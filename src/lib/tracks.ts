import { Track } from '../types'
import { wada } from '../theme/wada'

/**
 * Preset tracks are composed live in the browser with the Web Audio API,
 * so the app ships without any audio files (and without licensing headaches).
 */
export interface Chord {
  root: number
  notes: number[]
}

export interface Recipe {
  bpm: number
  swing?: number
  progression: Chord[]
  pad?: { wave: OscillatorType; gain: number; cutoff: number; attack: number }
  keys?: { steps: number[]; gain: number }
  bass?: { wave: OscillatorType; gain: number; steps: number[]; octaveJump?: boolean }
  arp?: { wave: OscillatorType; gain: number; pattern: number[]; every: 1 | 2; octave: number; cutoff?: number }
  drums?: { kick?: number[]; snare?: number[]; hat?: number[]; tom?: number[]; gain: number }
  chimes?: { notes: number[]; chance: number }
  birds?: number
  noise?: { kind: 'wind' | 'crackle'; gain: number }
  echo?: number
}

export interface PresetTrack extends Track {
  source: 'preset'
  recipe: Recipe
}

const EIGHTHS = [0, 2, 4, 6, 8, 10, 12, 14]
const SIXTEENTHS = Array.from({ length: 16 }, (_, i) => i)
const FOUR_FLOOR = [0, 4, 8, 12]

export const PRESET_TRACKS: PresetTrack[] = [
  {
    id: 'midnight-code',
    title: 'Midnight Code',
    artist: 'Synthwave Dreams',
    vibe: 'synthwave',
    colors: [wada.deepIndigo, wada.benzolGreen],
    source: 'preset',
    recipe: {
      bpm: 96,
      progression: [
        { root: 45, notes: [57, 60, 64] },
        { root: 41, notes: [53, 57, 60] },
        { root: 48, notes: [55, 60, 64] },
        { root: 43, notes: [55, 59, 62] },
      ],
      pad: { wave: 'sawtooth', gain: 0.035, cutoff: 1100, attack: 0.5 },
      bass: { wave: 'triangle', gain: 0.2, steps: EIGHTHS },
      arp: { wave: 'square', gain: 0.03, pattern: [0, 1, 2, 1], every: 1, octave: 1, cutoff: 2400 },
      drums: { kick: FOUR_FLOOR, snare: [4, 12], hat: EIGHTHS, gain: 0.5 },
      echo: 0.3,
    },
  },
  {
    id: 'autumn-breeze',
    title: 'Autumn Breeze',
    artist: 'Indie Folk',
    vibe: 'indie folk',
    colors: [wada.orange, wada.oliveOcher],
    source: 'preset',
    recipe: {
      bpm: 84,
      progression: [
        { root: 43, notes: [55, 59, 62] },
        { root: 38, notes: [54, 57, 62] },
        { root: 40, notes: [52, 55, 59] },
        { root: 36, notes: [52, 55, 60] },
      ],
      bass: { wave: 'sine', gain: 0.22, steps: [0, 8] },
      arp: { wave: 'triangle', gain: 0.07, pattern: [0, 2, 1, 2], every: 2, octave: 1, cutoff: 3200 },
      drums: { hat: [4, 12], gain: 0.25 },
      echo: 0.2,
    },
  },
  {
    id: 'ambient-spaces',
    title: 'Ambient Spaces',
    artist: 'Minimalist Sounds',
    vibe: 'ambient',
    colors: [wada.vandarPoelsBlue, wada.paleKingsBlue],
    source: 'preset',
    recipe: {
      bpm: 56,
      progression: [
        { root: 38, notes: [50, 54, 57, 61] },
        { root: 43, notes: [55, 59, 62, 66] },
        { root: 47, notes: [50, 54, 57, 59] },
        { root: 45, notes: [52, 57, 61, 64] },
      ],
      pad: { wave: 'sine', gain: 0.06, cutoff: 1800, attack: 2 },
      chimes: { notes: [74, 76, 78, 81, 83, 86], chance: 0.06 },
      noise: { kind: 'wind', gain: 0.02 },
      echo: 0.45,
    },
  },
  {
    id: 'digital-dreams',
    title: 'Digital Dreams',
    artist: 'Synthwave Vibes',
    vibe: 'synthwave',
    colors: [wada.redViolet, wada.rosolancPurple],
    source: 'preset',
    recipe: {
      bpm: 104,
      progression: [
        { root: 40, notes: [52, 55, 59] },
        { root: 36, notes: [52, 55, 60] },
        { root: 43, notes: [55, 59, 62] },
        { root: 38, notes: [54, 57, 62] },
      ],
      pad: { wave: 'sawtooth', gain: 0.03, cutoff: 900, attack: 0.3 },
      bass: { wave: 'sawtooth', gain: 0.1, steps: EIGHTHS, octaveJump: true },
      arp: { wave: 'sawtooth', gain: 0.025, pattern: [0, 1, 2, 3, 2, 1], every: 1, octave: 1, cutoff: 2000 },
      drums: { kick: FOUR_FLOOR, snare: [4, 12], hat: SIXTEENTHS, gain: 0.45 },
      echo: 0.35,
    },
  },
  {
    id: 'vinyl-groove',
    title: 'Vinyl Groove',
    artist: 'Chill Hop Beats',
    vibe: 'chillhop',
    colors: [wada.vandykeBrown, wada.rawSienna],
    source: 'preset',
    recipe: {
      bpm: 78,
      swing: 0.22,
      progression: [
        { root: 41, notes: [53, 57, 60, 64] },
        { root: 40, notes: [52, 55, 59, 62] },
        { root: 38, notes: [50, 53, 57, 60] },
        { root: 36, notes: [48, 52, 55, 59] },
      ],
      keys: { steps: [0, 6, 10], gain: 0.05 },
      bass: { wave: 'sine', gain: 0.24, steps: [0, 7, 10] },
      drums: { kick: [0, 7, 10], snare: [4, 12], hat: EIGHTHS, gain: 0.55 },
      noise: { kind: 'crackle', gain: 0.05 },
      echo: 0.15,
    },
  },
  {
    id: 'nature-sounds',
    title: 'Nature Sounds',
    artist: 'Forest Ambient',
    vibe: 'nature',
    colors: [wada.diamineGreen, wada.khaki],
    source: 'preset',
    recipe: {
      bpm: 60,
      progression: [
        { root: 36, notes: [55, 60, 64] },
        { root: 45, notes: [57, 60, 64] },
        { root: 41, notes: [57, 60, 65] },
        { root: 43, notes: [55, 59, 62] },
      ],
      pad: { wave: 'sine', gain: 0.035, cutoff: 1400, attack: 2.5 },
      chimes: { notes: [72, 74, 76, 79, 81], chance: 0.04 },
      birds: 0.05,
      noise: { kind: 'wind', gain: 0.05 },
      echo: 0.3,
    },
  },
  {
    id: 'retro-vibes',
    title: 'Retro Vibes',
    artist: '80s Synthpop',
    vibe: 'synthpop',
    colors: [wada.hermosaPink, wada.calamineBlue],
    source: 'preset',
    recipe: {
      bpm: 112,
      progression: [
        { root: 36, notes: [55, 60, 64] },
        { root: 43, notes: [55, 59, 62] },
        { root: 45, notes: [57, 60, 64] },
        { root: 41, notes: [57, 60, 65] },
      ],
      pad: { wave: 'square', gain: 0.02, cutoff: 1500, attack: 0.05 },
      bass: { wave: 'square', gain: 0.08, steps: EIGHTHS, octaveJump: true },
      arp: { wave: 'triangle', gain: 0.06, pattern: [0, 2, 1, 2], every: 1, octave: 1 },
      drums: { kick: FOUR_FLOOR, snare: [4, 12], hat: EIGHTHS, gain: 0.5 },
      echo: 0.25,
    },
  },
  {
    id: 'world-mix',
    title: 'World Music Mix',
    artist: 'Global Sounds',
    vibe: 'world',
    colors: [wada.deepLyonsBlue, wada.yellowOcher],
    source: 'preset',
    recipe: {
      bpm: 90,
      progression: [
        { root: 38, notes: [62, 65, 69] },
        { root: 36, notes: [60, 64, 67] },
        { root: 34, notes: [58, 62, 65] },
        { root: 36, notes: [60, 64, 67] },
      ],
      bass: { wave: 'sine', gain: 0.2, steps: [0, 6, 10] },
      arp: { wave: 'sine', gain: 0.09, pattern: [0, 2, 1, 2, 0, 1], every: 2, octave: 1 },
      drums: { tom: [0, 3, 6, 10, 12], hat: [2, 6, 10, 14], gain: 0.5 },
      chimes: { notes: [74, 77, 79, 81, 84], chance: 0.03 },
      echo: 0.25,
    },
  },
]

export const getPresetTrack = (id: string) => PRESET_TRACKS.find(t => t.id === id)
