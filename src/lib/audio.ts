import { Recipe } from './tracks'

/**
 * A tiny generative music engine on top of the Web Audio API,
 * plus the cabin hum and playback for user-uploaded files.
 */

const midiToFreq = (m: number) => 440 * Math.pow(2, (m - 69) / 12)

let ctx: AudioContext | null = null
let master: GainNode | null = null
let noiseBuffer: AudioBuffer | null = null
let brownBuffer: AudioBuffer | null = null
let crackleBuffer: AudioBuffer | null = null

function getCtx(): AudioContext | null {
  if (ctx) return ctx
  const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
  if (!Ctor) return null
  ctx = new Ctor()
  master = ctx.createGain()
  master.gain.value = 0.8
  master.connect(ctx.destination)
  return ctx
}

/** Call from a user gesture (tap/click) so browsers allow sound. */
export function unlockAudio() {
  const c = getCtx()
  if (c && c.state === 'suspended') void c.resume()
}

function makeNoise(c: AudioContext, kind: 'white' | 'brown' | 'crackle'): AudioBuffer {
  const len = c.sampleRate * 3
  const buf = c.createBuffer(1, len, c.sampleRate)
  const data = buf.getChannelData(0)
  let last = 0
  for (let i = 0; i < len; i++) {
    const white = Math.random() * 2 - 1
    if (kind === 'white') data[i] = white
    else if (kind === 'brown') {
      last = (last + 0.02 * white) / 1.02
      data[i] = last * 3.5
    } else {
      data[i] = Math.random() < 0.0006 ? white * 0.9 : white * 0.015
    }
  }
  return buf
}

function noise(c: AudioContext, kind: 'white' | 'brown' | 'crackle') {
  if (kind === 'white') return (noiseBuffer ??= makeNoise(c, 'white'))
  if (kind === 'brown') return (brownBuffer ??= makeNoise(c, 'brown'))
  return (crackleBuffer ??= makeNoise(c, 'crackle'))
}

// ---------------------------------------------------------------------------
// Generative tracks
// ---------------------------------------------------------------------------

interface Session {
  bus: GainNode
  echoIn: GainNode
  timer: number
  loops: AudioScheduledSourceNode[]
}

let session: Session | null = null

function env(g: GainNode, t: number, attack: number, peak: number, decay: number) {
  g.gain.setValueAtTime(0.0001, t)
  g.gain.linearRampToValueAtTime(peak, t + attack)
  g.gain.exponentialRampToValueAtTime(0.0001, t + attack + decay)
}

function tone(
  c: AudioContext,
  dest: AudioNode,
  freq: number,
  t: number,
  opts: { wave: OscillatorType; gain: number; attack: number; decay: number; cutoff?: number; detune?: number },
) {
  const osc = c.createOscillator()
  osc.type = opts.wave
  osc.frequency.value = freq
  if (opts.detune) osc.detune.value = opts.detune
  const g = c.createGain()
  env(g, t, opts.attack, opts.gain, opts.decay)
  let node: AudioNode = osc
  if (opts.cutoff) {
    const f = c.createBiquadFilter()
    f.type = 'lowpass'
    f.frequency.value = opts.cutoff
    osc.connect(f)
    node = f
  }
  node.connect(g)
  g.connect(dest)
  osc.start(t)
  osc.stop(t + opts.attack + opts.decay + 0.05)
}

function noiseHit(c: AudioContext, dest: AudioNode, t: number, type: BiquadFilterType, freq: number, gain: number, decay: number) {
  const src = c.createBufferSource()
  src.buffer = noise(c, 'white')
  const f = c.createBiquadFilter()
  f.type = type
  f.frequency.value = freq
  const g = c.createGain()
  env(g, t, 0.002, gain, decay)
  src.connect(f).connect(g).connect(dest)
  src.start(t, Math.random() * 2)
  src.stop(t + decay + 0.05)
}

function kick(c: AudioContext, dest: AudioNode, t: number, gain: number) {
  const osc = c.createOscillator()
  osc.frequency.setValueAtTime(130, t)
  osc.frequency.exponentialRampToValueAtTime(42, t + 0.14)
  const g = c.createGain()
  env(g, t, 0.003, gain, 0.28)
  osc.connect(g).connect(dest)
  osc.start(t)
  osc.stop(t + 0.35)
}

function tom(c: AudioContext, dest: AudioNode, t: number, gain: number) {
  const osc = c.createOscillator()
  const base = 110 + Math.random() * 60
  osc.frequency.setValueAtTime(base, t)
  osc.frequency.exponentialRampToValueAtTime(base * 0.6, t + 0.2)
  const g = c.createGain()
  env(g, t, 0.003, gain, 0.3)
  osc.connect(g).connect(dest)
  osc.start(t)
  osc.stop(t + 0.4)
}

function bird(c: AudioContext, dest: AudioNode, t: number) {
  const chirps = 2 + Math.floor(Math.random() * 3)
  const base = 2200 + Math.random() * 1500
  for (let i = 0; i < chirps; i++) {
    const st = t + i * 0.11
    const osc = c.createOscillator()
    osc.frequency.setValueAtTime(base, st)
    osc.frequency.exponentialRampToValueAtTime(base * 1.5, st + 0.06)
    const g = c.createGain()
    env(g, st, 0.01, 0.025, 0.07)
    osc.connect(g).connect(dest)
    osc.start(st)
    osc.stop(st + 0.1)
  }
}

export function playRecipe(recipe: Recipe) {
  const c = getCtx()
  if (!c || !master) return
  unlockAudio()
  stopRecipe()

  const bus = c.createGain()
  bus.gain.setValueAtTime(0.0001, c.currentTime)
  bus.gain.linearRampToValueAtTime(1, c.currentTime + 1.2)
  const warmth = c.createBiquadFilter()
  warmth.type = 'lowpass'
  warmth.frequency.value = 6000
  bus.connect(warmth).connect(master)

  // Echo send
  const echoIn = c.createGain()
  echoIn.gain.value = recipe.echo ?? 0
  const delay = c.createDelay(1)
  delay.delayTime.value = (60 / recipe.bpm) * 0.75
  const fb = c.createGain()
  fb.gain.value = 0.35
  echoIn.connect(delay)
  delay.connect(fb).connect(delay)
  delay.connect(bus)

  const loops: AudioScheduledSourceNode[] = []
  if (recipe.noise) {
    const src = c.createBufferSource()
    src.buffer = noise(c, recipe.noise.kind === 'wind' ? 'brown' : 'crackle')
    src.loop = true
    const g = c.createGain()
    g.gain.value = recipe.noise.gain * (recipe.noise.kind === 'wind' ? 3 : 4)
    const f = c.createBiquadFilter()
    f.type = recipe.noise.kind === 'wind' ? 'bandpass' : 'highpass'
    f.frequency.value = recipe.noise.kind === 'wind' ? 500 : 1500
    if (recipe.noise.kind === 'wind') {
      const lfo = c.createOscillator()
      lfo.frequency.value = 0.08
      const lfoGain = c.createGain()
      lfoGain.gain.value = 300
      lfo.connect(lfoGain).connect(f.frequency)
      lfo.start()
      loops.push(lfo)
    }
    src.connect(f).connect(g).connect(bus)
    src.start()
    loops.push(src)
  }

  const sixteenth = 60 / recipe.bpm / 4
  let step = 0
  let nextTime = c.currentTime + 0.1

  const schedule = (s: number, t: number) => {
    const bar = Math.floor(s / 16)
    const pos = s % 16
    const chord = recipe.progression[bar % recipe.progression.length]
    const barLen = sixteenth * 16

    if (recipe.pad && pos === 0) {
      const p = recipe.pad
      for (const n of chord.notes) {
        for (const detune of [-6, 6]) {
          tone(c, bus, midiToFreq(n), t, { wave: p.wave, gain: p.gain, attack: p.attack, decay: barLen + 0.4, cutoff: p.cutoff, detune })
        }
      }
    }
    if (recipe.keys?.steps.includes(pos)) {
      for (const n of chord.notes) {
        tone(c, bus, midiToFreq(n), t, { wave: 'sine', gain: recipe.keys.gain, attack: 0.01, decay: 0.9 })
        tone(c, bus, midiToFreq(n + 12), t, { wave: 'triangle', gain: recipe.keys.gain * 0.25, attack: 0.01, decay: 0.4 })
      }
    }
    if (recipe.bass?.steps.includes(pos)) {
      const b = recipe.bass
      const note = b.octaveJump && pos % 4 === 2 ? chord.root + 12 : chord.root
      tone(c, bus, midiToFreq(note), t, { wave: b.wave, gain: b.gain, attack: 0.01, decay: sixteenth * 1.8, cutoff: 600 })
    }
    if (recipe.arp && pos % recipe.arp.every === 0) {
      const a = recipe.arp
      const idx = a.pattern[(pos / a.every) % a.pattern.length] % chord.notes.length
      const note = chord.notes[idx] + 12 * a.octave
      const dest = c.createGain()
      dest.connect(bus)
      dest.connect(echoIn)
      tone(c, dest, midiToFreq(note), t, { wave: a.wave, gain: a.gain, attack: 0.005, decay: sixteenth * 1.6, cutoff: a.cutoff })
    }
    if (recipe.drums) {
      const d = recipe.drums
      if (d.kick?.includes(pos)) kick(c, bus, t, d.gain * 0.9)
      if (d.snare?.includes(pos)) noiseHit(c, bus, t, 'bandpass', 1800, d.gain * 0.35, 0.16)
      if (d.hat?.includes(pos)) noiseHit(c, bus, t, 'highpass', 7000, d.gain * (pos % 4 === 2 ? 0.12 : 0.07), 0.04)
      if (d.tom?.includes(pos)) tom(c, bus, t, d.gain * 0.6)
    }
    if (recipe.chimes && Math.random() < recipe.chimes.chance) {
      const n = recipe.chimes.notes[Math.floor(Math.random() * recipe.chimes.notes.length)]
      tone(c, echoIn, midiToFreq(n), t, { wave: 'sine', gain: 0.05, attack: 0.005, decay: 2.2 })
      tone(c, bus, midiToFreq(n), t, { wave: 'sine', gain: 0.04, attack: 0.005, decay: 2.2 })
    }
    if (recipe.birds && Math.random() < recipe.birds) bird(c, bus, t)
  }

  const timer = window.setInterval(() => {
    while (nextTime < c.currentTime + 0.15) {
      const swing = recipe.swing && step % 2 === 1 ? recipe.swing * sixteenth : 0
      schedule(step, nextTime + swing)
      nextTime += sixteenth
      step++
    }
  }, 25)

  session = { bus, echoIn, timer, loops }
}

export function stopRecipe() {
  if (!session || !ctx) return
  const s = session
  session = null
  window.clearInterval(s.timer)
  const now = ctx.currentTime
  s.bus.gain.cancelScheduledValues(now)
  s.bus.gain.setValueAtTime(s.bus.gain.value, now)
  s.bus.gain.linearRampToValueAtTime(0.0001, now + 0.4)
  window.setTimeout(() => {
    s.loops.forEach(l => {
      try {
        l.stop()
      } catch {
        /* already stopped */
      }
    })
    s.bus.disconnect()
    s.echoIn.disconnect()
  }, 500)
}

// ---------------------------------------------------------------------------
// User uploads
// ---------------------------------------------------------------------------

let fileAudio: HTMLAudioElement | null = null

export function playFile(url: string) {
  stopFile()
  fileAudio = new Audio(url)
  fileAudio.loop = true
  fileAudio.volume = 0.8
  void fileAudio.play().catch(() => undefined)
}

export function stopFile() {
  if (fileAudio) {
    fileAudio.pause()
    fileAudio = null
  }
}

// ---------------------------------------------------------------------------
// Physics sounds
// ---------------------------------------------------------------------------

let lastThump = 0

/** A soft wooden thump when furniture lands. strength is 0–1. */
export function thump(strength: number) {
  const c = ctx
  if (!c || !master || c.state !== 'running') return
  const now = c.currentTime
  if (now - lastThump < 0.04) return // several things landing at once shouldn't clip
  lastThump = now
  const gain = 0.05 + 0.25 * Math.min(1, strength)
  const osc = c.createOscillator()
  osc.frequency.setValueAtTime(95 + Math.random() * 30, now)
  osc.frequency.exponentialRampToValueAtTime(45, now + 0.12)
  const g = c.createGain()
  env(g, now, 0.002, gain, 0.18)
  osc.connect(g).connect(master)
  osc.start(now)
  osc.stop(now + 0.22)
  noiseHit(c, master, now, 'lowpass', 900, gain * 0.5, 0.06)
}

/** A low rumble for turbulence. */
export function rumble() {
  const c = ctx
  if (!c || !master || c.state !== 'running') return
  const now = c.currentTime
  const src = c.createBufferSource()
  src.buffer = noise(c, 'brown')
  const f = c.createBiquadFilter()
  f.type = 'lowpass'
  f.frequency.value = 140
  const g = c.createGain()
  g.gain.setValueAtTime(0.0001, now)
  g.gain.linearRampToValueAtTime(0.5, now + 0.15)
  g.gain.exponentialRampToValueAtTime(0.0001, now + 1.4)
  src.connect(f).connect(g).connect(master)
  src.start(now)
  src.stop(now + 1.5)
}

// ---------------------------------------------------------------------------
// Cabin hum
// ---------------------------------------------------------------------------

let hum: { src: AudioBufferSourceNode; gain: GainNode } | null = null

export function setCabinHum(on: boolean) {
  const c = getCtx()
  if (!c || !master) return
  if (on && !hum) {
    unlockAudio()
    const src = c.createBufferSource()
    src.buffer = noise(c, 'brown')
    src.loop = true
    const f = c.createBiquadFilter()
    f.type = 'lowpass'
    f.frequency.value = 260
    const gain = c.createGain()
    gain.gain.setValueAtTime(0.0001, c.currentTime)
    gain.gain.linearRampToValueAtTime(0.09, c.currentTime + 2)
    src.connect(f).connect(gain).connect(master)
    src.start()
    hum = { src, gain }
  } else if (!on && hum) {
    const h = hum
    hum = null
    h.gain.gain.cancelScheduledValues(c.currentTime)
    h.gain.gain.setValueAtTime(h.gain.gain.value, c.currentTime)
    h.gain.gain.linearRampToValueAtTime(0.0001, c.currentTime + 0.6)
    window.setTimeout(() => h.src.stop(), 700)
  }
}
