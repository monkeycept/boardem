import { useCallback, useEffect, useRef, useState } from 'react'
import { FurnitureItem } from '../types'
import { loadPhysics, PoseMap, SimHandle, simulate } from '../lib/physics'
import { rumble, thump } from '../lib/audio'

interface Options {
  /** Where the room's furniture comes from (read fresh at the start of each simulation). */
  getItems: () => FurnitureItem[]
  /** Save settled poses. Without it, the room keeps showing where things ended up (visitor mode). */
  onSettle?: (poses: PoseMap) => void
}

/**
 * Runs short Bullet simulations for a room and exposes the moving poses for drawing.
 * Only one simulation runs at a time; a new event picks up from wherever things are.
 */
export function useRoomPhysics({ getItems, onSettle }: Options) {
  const [poses, setPoses] = useState<PoseMap | null>(null)
  const [running, setRunning] = useState(false)
  const [shaking, setShaking] = useState(false)
  const handleRef = useRef<SimHandle | null>(null)
  const posesRef = useRef<PoseMap | null>(null)
  const opts = useRef({ getItems, onSettle })
  opts.current = { getItems, onSettle }

  const run = useCallback(async (kind: { drop?: string[]; nudge?: string; jolt?: number }) => {
    let A
    try {
      A = await loadPhysics()
    } catch (err) {
      console.warn('Physics engine failed to load; furniture will stay put', err)
      return
    }
    const previous = handleRef.current
    if (previous) {
      previous.cancel()
      await previous.done
    }
    const items = opts.current.getItems()
    if (!items.length) return
    setRunning(true)
    const handle = simulate(A, {
      items,
      from: posesRef.current ?? undefined,
      ...kind,
      onFrame: p => {
        posesRef.current = p
        setPoses(p)
      },
      onImpact: thump,
    })
    handleRef.current = handle
    const settled = await handle.done
    if (handleRef.current !== handle) return // a newer simulation took over
    handleRef.current = null
    setRunning(false)
    if (opts.current.onSettle) {
      opts.current.onSettle(settled)
      posesRef.current = null
      setPoses(null)
    } else {
      posesRef.current = settled
      setPoses(settled)
    }
  }, [])

  const drop = useCallback((ids: string[]) => void run({ drop: ids }), [run])
  const nudge = useCallback((id: string) => void run({ nudge: id }), [run])
  const turbulence = useCallback(
    (strength = 1) => {
      rumble()
      setShaking(true)
      window.setTimeout(() => setShaking(false), 900)
      void run({ jolt: strength })
    },
    [run],
  )
  /** Forget any unsaved poses (e.g. when the room's layout is replaced). */
  const reset = useCallback(() => {
    handleRef.current?.cancel()
    handleRef.current = null
    posesRef.current = null
    setPoses(null)
    setRunning(false)
  }, [])

  // Warm the engine up in the background so the first drop is instant.
  useEffect(() => {
    const t = window.setTimeout(() => void loadPhysics().catch(() => undefined), 1200)
    return () => {
      window.clearTimeout(t)
      handleRef.current?.cancel()
    }
  }, [])

  return { poses, running, shaking, drop, nudge, turbulence, reset }
}
