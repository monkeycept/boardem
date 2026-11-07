/**
 * Bullet physics (via ammo.js, the official Emscripten build of Bullet) for the loft.
 *
 * The room is drawn as a front view, so it's mapped into a 3D Bullet world:
 *   X  = left → right            (room x)
 *   Y  = height above the floor   (drawn as moving up the screen)
 *   Z  = depth into the room       (room y of the item's base, from the wall to the front)
 * Floor items are boxes resting on the floor plane, boxed in by the walls; items at
 * different depths pass behind each other. Wall art hangs on a hinge at its top edge
 * and swings in the plane of the wall.
 *
 * The engine (~1.2 MB of WebAssembly) is only downloaded the first time it's needed.
 */
import type Ammo from 'ammojs-typed'
import wasmUrl from 'ammojs-typed/ammo.wasm.wasm?url'
import { FurnitureItem } from '../types'
import { ALBUM_SIZE, getCatalogItem, ROOM_H, ROOM_W, WALL_H } from './room'

type AmmoLib = typeof Ammo

/** Room units → metres. Keeps bodies in the 0.5–3 m range Bullet handles best. */
const S = 0.02
const GROUP_FLOOR_ITEM = 1
const GROUP_STATIC = 2
const GROUP_WALL_ART = 4

let ammoLoad: Promise<AmmoLib> | null = null

export function loadPhysics(): Promise<AmmoLib> {
  ammoLoad ??= (async () => {
    const mod = (await import('ammojs-typed/wasm')) as unknown as { default?: unknown }
    const factory = (mod.default ?? mod) as (this: object, opts: object) => { then: (cb: (lib: AmmoLib) => void) => void }
    // The Emscripten wrapper assigns `this.Ammo`, and `this` is undefined inside an ES module,
    // so give it an object to write to. Its result can itself be "thenable"; unwrap it inside
    // a plain object so awaiting it doesn't recurse.
    const holder = {}
    const opts: Record<string, unknown> = { locateFile: () => wasmUrl }
    // Single-file builds inline the engine as a data: URI. Decode it here rather than
    // fetching it, since some sandboxed pages don't allow fetching data: URIs.
    if (wasmUrl.startsWith('data:')) {
      const b64 = wasmUrl.slice(wasmUrl.indexOf(',') + 1)
      opts.wasmBinary = Uint8Array.from(atob(b64), c => c.charCodeAt(0)).buffer
    }
    const { lib } = await new Promise<{ lib: AmmoLib }>(resolve => factory.call(holder, opts).then(l => resolve({ lib: l })))
    return lib
  })()
  return ammoLoad
}

export interface Pose {
  x: number
  y: number
  rotation: number
}

export type PoseMap = Record<string, Pose>

export interface SimRequest {
  items: FurnitureItem[]
  /** Starting poses (e.g. from a simulation that's still on screen); defaults to the items' own. */
  from?: PoseMap
  /** Items that fall in from above (newly added). */
  drop?: string[]
  /** An item just placed by hand: it settles from a small height and shoves anything it lands in. */
  nudge?: string
  /** Turbulence strength, 0–1. Shakes everything. */
  jolt?: number
  onFrame: (poses: PoseMap) => void
  /** Called when something lands hard enough to hear (0–1). */
  onImpact?: (strength: number) => void
}

export interface SimHandle {
  /** Resolves with the settled poses (or the current ones if cancelled). */
  done: Promise<PoseMap>
  cancel: () => void
}

const isWallArt = (item: FurnitureItem) => getCatalogItem(item.type).zone === 'wall' || item.type === 'album'

const footprint = (item: FurnitureItem) => {
  const cat = getCatalogItem(item.type)
  const w = (item.type === 'album' ? ALBUM_SIZE : cat.w) * item.scale
  const h = (item.type === 'album' ? ALBUM_SIZE : cat.h) * item.scale
  return { w, h }
}

export function simulate(A: AmmoLib, req: SimRequest): SimHandle {
  const cleanup: (() => void)[] = []
  // Everything allocated in the Bullet heap is freed when the simulation ends.
  const keep = <T extends object>(obj: T): T => {
    cleanup.push(() => A.destroy(obj))
    return obj
  }

  const config = keep(new A.btDefaultCollisionConfiguration())
  const dispatcher = keep(new A.btCollisionDispatcher(config))
  const broadphase = keep(new A.btDbvtBroadphase())
  const solver = keep(new A.btSequentialImpulseConstraintSolver())
  const world = keep(new A.btDiscreteDynamicsWorld(dispatcher, broadphase, solver, config))
  world.setGravity(keep(new A.btVector3(0, -9.8, 0)))

  const v3 = (x: number, y: number, z: number) => keep(new A.btVector3(x, y, z))

  // The room: floor, side walls, back wall and an invisible front edge.
  const planes: [number, number, number, number][] = [
    [0, 1, 0, 0],
    [1, 0, 0, 0],
    [-1, 0, 0, -ROOM_W * S],
    [0, 0, 1, WALL_H * S],
    [0, 0, -1, -ROOM_H * S],
  ]
  for (const [nx, ny, nz, c] of planes) {
    const shape = keep(new A.btStaticPlaneShape(v3(nx, ny, nz), c))
    const t = keep(new A.btTransform())
    t.setIdentity()
    const ms = keep(new A.btDefaultMotionState(t))
    const info = keep(new A.btRigidBodyConstructionInfo(0, ms, shape, v3(0, 0, 0)))
    const body = keep(new A.btRigidBody(info))
    body.setFriction(0.7)
    body.setRestitution(0.2)
    world.addRigidBody(body, GROUP_STATIC, GROUP_FLOOR_ITEM)
  }

  interface Tracked {
    id: string
    body: Ammo.btRigidBody
    mass: number
    wall: boolean
    halfH: number
    baseRotation: number
    lastVy: number
  }
  const tracked: Tracked[] = []
  const jolt = req.jolt ?? 0

  for (const item of req.items) {
    if (item.type === 'rug') continue
    const start = req.from?.[item.id] ?? { x: item.x, y: item.y, rotation: item.rotation }
    const { w, h } = footprint(item)
    const wall = isWallArt(item)
    const hx = (w / 2) * S * 0.8
    const hy = (h / 2) * S
    const hz = wall ? 0.05 : Math.max(0.12, Math.min(w, h) * 0.22 * S)
    const mass = Math.max(0.5, (w * h) / 1500)

    const t = keep(new A.btTransform())
    t.setIdentity()
    const q = keep(new A.btQuaternion(0, 0, 0, 1))

    if (wall) {
      // Wall art: centre in wall coordinates (Y up from the ceiling line), hanging from a nail.
      t.setOrigin(v3(start.x * S, -start.y * S, 0))
      q.setEulerZYX(0, 0, 0)
    } else {
      const lift = req.drop?.includes(item.id) ? 2.2 + Math.random() * 0.8 : req.nudge === item.id ? 0.35 : 0
      const baseDepth = start.y + h / 2
      t.setOrigin(v3(start.x * S, hy + 0.001 + lift, Math.min(ROOM_H - 4, Math.max(WALL_H + 4, baseDepth)) * S))
      q.setEulerZYX((-start.rotation * Math.PI) / 180, 0, 0)
    }
    t.setRotation(q)

    const shape = keep(new A.btBoxShape(v3(hx, hy, hz)))
    const inertia = v3(0, 0, 0)
    shape.calculateLocalInertia(mass, inertia)
    const ms = keep(new A.btDefaultMotionState(t))
    const info = keep(new A.btRigidBodyConstructionInfo(mass, ms, shape, inertia))
    const body = keep(new A.btRigidBody(info))
    body.setActivationState(4) // never sleep mid-animation; we decide when it's settled
    body.setFriction(0.6)
    body.setRestitution(0.28)
    body.setDamping(0.08, 0.35)
    // Pieces only spin in the plane you can see; they can't turn to face the wall.
    body.setAngularFactor(v3(0, 0, 1))

    if (wall) {
      world.addRigidBody(body, GROUP_WALL_ART, 0)
      // Nail at the top edge. A Bullet hinge turns about its frame's Z axis — here, into the wall.
      const pivot = keep(new A.btTransform())
      pivot.setIdentity()
      pivot.setOrigin(v3(0, hy, 0))
      const hinge = keep(new A.btHingeConstraint(body, pivot, true))
      world.addConstraint(hinge, true)
      // Enough drag that a frame swings a few times and comes to rest, like a real one.
      body.setDamping(0.05, 0.45)
      if (req.drop?.includes(item.id)) body.setAngularVelocity(v3(0, 0, (Math.random() - 0.5) * 6))
    } else {
      world.addRigidBody(body, GROUP_FLOOR_ITEM, GROUP_FLOOR_ITEM | GROUP_STATIC)
    }
    tracked.push({ id: item.id, body, mass, wall, halfH: hy, baseRotation: start.rotation, lastVy: 0 })
  }

  // Turbulence: a few sharp jolts over ~0.7 s.
  const joltTimes = jolt > 0 ? [0, 0.18, 0.4, 0.66] : []
  const applyJolt = (k: number) => {
    const strength = jolt * (1 - k * 0.2)
    const sway = (Math.random() - 0.5) * 2
    for (const t of tracked) {
      const m = t.mass
      if (t.wall) {
        t.body.applyTorqueImpulse(v3(0, 0, (Math.random() - 0.5) * 0.6 * strength * m))
      } else {
        t.body.applyCentralImpulse(v3(sway * 2.2 * strength * m, (2.4 + Math.random() * 1.6) * strength * m, (Math.random() - 0.5) * 1.6 * strength * m))
        t.body.applyTorqueImpulse(v3(0, 0, (Math.random() - 0.5) * 0.35 * strength * m))
      }
    }
  }

  const tmp = keep(new A.btTransform())
  const read = (): PoseMap => {
    const out: PoseMap = {}
    for (const t of tracked) {
      t.body.getMotionState().getWorldTransform(tmp)
      const o = tmp.getOrigin()
      const r = tmp.getRotation()
      const angle = 2 * Math.atan2(r.z(), r.w())
      if (t.wall) {
        // Swing is relative to how the piece was hung, so a deliberately tilted frame stays tilted.
        out[t.id] = { x: o.x() / S, y: -o.y() / S, rotation: t.baseRotation + (-angle * 180) / Math.PI }
      } else {
        out[t.id] = { x: o.x() / S, y: (o.z() - o.y()) / S, rotation: ((-angle * 180) / Math.PI + 360) % 360 }
      }
    }
    return out
  }

  let raf = 0
  let finished = false
  let resolveDone!: (p: PoseMap) => void
  const done = new Promise<PoseMap>(r => (resolveDone = r))
  let elapsed = 0
  let calm = 0
  let last = performance.now()
  let nextJolt = 0

  const finish = () => {
    if (finished) return
    finished = true
    cancelAnimationFrame(raf)
    const poses = read()
    // Snap near-upright pieces back to exactly upright so layouts stay tidy.
    for (const t of tracked) {
      const p = poses[t.id]
      if (!t.wall) {
        for (const snap of [0, 90, 180, 270, 360]) if (Math.abs(p.rotation - snap) < 4) p.rotation = snap % 360
      } else {
        p.rotation = t.baseRotation
      }
    }
    cleanup.reverse().forEach(fn => {
      try {
        fn()
      } catch {
        /* already freed */
      }
    })
    resolveDone(poses)
  }

  const tick = (now: number) => {
    const dt = Math.min(1 / 30, (now - last) / 1000)
    last = now
    elapsed += dt
    while (nextJolt < joltTimes.length && elapsed >= joltTimes[nextJolt]) applyJolt(nextJolt++)
    world.stepSimulation(dt, 5, 1 / 120)

    // Landing thumps and the "has everything stopped?" check.
    let moving = false
    for (const t of tracked) {
      const lv = t.body.getLinearVelocity()
      const av = t.body.getAngularVelocity()
      if (!t.wall) {
        const vy = lv.y()
        if (t.lastVy < -1.2 && vy > t.lastVy + 1) req.onImpact?.(Math.min(1, -t.lastVy / 7))
        t.lastVy = vy
        if (lv.length() > 0.04 || Math.abs(av.z()) > 0.05) moving = true
      } else if (elapsed < 3.5 && Math.abs(av.z()) > 0.08) {
        // A last little sway on the wall shouldn't hold up saving the floor layout.
        moving = true
      }
    }
    req.onFrame(read())
    calm = moving || nextJolt < joltTimes.length ? 0 : calm + 1
    if (calm > 20 || elapsed > 6) finish()
    else raf = requestAnimationFrame(tick)
  }
  raf = requestAnimationFrame(tick)

  return {
    done,
    cancel: () => {
      if (!finished) finish()
    },
  }
}
