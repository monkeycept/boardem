import { FurnitureType } from '../types'
import { wada as w } from '../theme/wada'

/** Every loft is laid out in the same logical room, then scaled to fit the screen. */
export const ROOM_W = 460
export const ROOM_H = 380
export const WALL_H = 150

/** Mix two hex colours (t = 0 → a, 1 → b). */
export const mix = (a: string, b: string, t: number) => {
  const pa = parseInt(a.slice(1), 16)
  const pb = parseInt(b.slice(1), 16)
  const ch = (shift: number) => Math.round(((pa >> shift) & 255) * (1 - t) + ((pb >> shift) & 255) * t)
  return `#${[16, 8, 0].map(s => ch(s).toString(16).padStart(2, '0')).join('')}`
}

export interface Wallpaper {
  id: string
  label: string
  /** Number of the combination in Wada's dictionary. */
  combo: number
  top: string
  bottom: string
  accent: string
}

/** Each wall is one of Wada's three-colour combinations: dark at the ceiling, mid near the floor, light trim. */
const wall = (id: string, label: string, combo: number, dark: string, mid: string, light: string): Wallpaper => ({
  id,
  label,
  combo,
  top: dark,
  bottom: mix(dark, mid, 0.55),
  accent: light,
})

export const WALLPAPERS: Wallpaper[] = [
  wall('dark-neon', 'Night Teal', 155, w.deepIndigo, w.benzolGreen, w.jasperRed),
  wall('dark-purple', 'Plum Marigold', 170, w.redViolet, w.rosolancPurple, w.orangeYellow),
  wall('deep-blue', 'Lapis', 126, w.deepLyonsBlue, w.yellowOcher, w.ivoryBuff),
  wall('harbor-dusk', 'Harbor Dusk', 141, w.darkTyrianBlue, w.orange, w.yellowGreen),
  wall('forest-green', 'Lantern', 149, w.deepSlateGreen, w.orange, w.oliveOcher),
  wall('twilight', 'Twilight', 125, w.violetBlue, w.cerulianBlue, w.fawn),
  wall('warm-brown', 'Tobacco', 192, w.vandykeBrown, w.plumbeous, w.creamYellow),
  wall('ocean-blue', 'Fjord', 167, w.vandarPoelsBlue, w.ecru, w.paleKingsBlue),
  { id: 'pastel-pink', label: 'Sakura', combo: 176, top: w.hermosaPink, bottom: mix(w.hermosaPink, w.seashellPink, 0.6), accent: w.calamineBlue },
  { id: 'light-gray', label: 'Garden', combo: 135, top: w.salviaBlue, bottom: mix(w.salviaBlue, w.sulpherYellow, 0.55), accent: w.cossackGreen },
]

export interface Floor {
  id: string
  label: string
  base: string
  line: string
  pattern: 'planks' | 'tiles' | 'grid' | 'checker' | 'plain' | 'mats'
}

export const FLOORS: Floor[] = [
  { id: 'wood', label: 'Umber Oak', base: w.paleRawUmber, line: w.vandykeBrown, pattern: 'planks' },
  { id: 'marble', label: 'Stone', base: w.neutralGray, line: w.plumbeous, pattern: 'tiles' },
  { id: 'neon-grid', label: 'Indigo Grid', base: w.deepIndigo, line: w.benzolGreen, pattern: 'grid' },
  { id: 'carpet', label: 'Lyons Carpet', base: w.deepLyonsBlue, line: w.violetBlue, pattern: 'plain' },
  { id: 'moss', label: 'Moss', base: w.lincolnGreen, line: w.deepGrayishOlive, pattern: 'plain' },
  { id: 'retro-tile', label: 'Checker', base: w.seashellPink, line: w.rosolancPurple, pattern: 'checker' },
  { id: 'concrete', label: 'Slate', base: w.slateColor, line: w.darkMediciBlue, pattern: 'tiles' },
  { id: 'tatami', label: 'Tatami', base: w.oliveYellow, line: w.deepGrayishOlive, pattern: 'mats' },
]

export const getWallpaper = (id: string) => WALLPAPERS.find(w => w.id === id) ?? WALLPAPERS[0]
export const getFloor = (id: string) => FLOORS.find(f => f.id === id) ?? FLOORS[0]

export interface CatalogItem {
  type: FurnitureType
  label: string
  emoji: string
  /** Base footprint in room units. */
  w: number
  h: number
  /** Default placement zone. */
  zone: 'wall' | 'floor'
}

export const FURNITURE_CATALOG: CatalogItem[] = [
  { type: 'bed', label: 'Bed', emoji: '🛏️', w: 90, h: 70, zone: 'floor' },
  { type: 'couch', label: 'Couch', emoji: '🛋️', w: 86, h: 64, zone: 'floor' },
  { type: 'desk', label: 'Desk', emoji: '🖥️', w: 64, h: 60, zone: 'floor' },
  { type: 'plant', label: 'Plant', emoji: '🪴', w: 50, h: 56, zone: 'floor' },
  { type: 'lamp', label: 'Lamp', emoji: '💡', w: 44, h: 50, zone: 'floor' },
  { type: 'rug', label: 'Rug', emoji: '🟣', w: 120, h: 56, zone: 'floor' },
  { type: 'speaker', label: 'Speaker', emoji: '🔊', w: 48, h: 52, zone: 'floor' },
  { type: 'tv', label: 'TV', emoji: '📺', w: 62, h: 56, zone: 'floor' },
  { type: 'poster', label: 'Poster', emoji: '🌌', w: 46, h: 62, zone: 'wall' },
  { type: 'shelf', label: 'Shelf', emoji: '📚', w: 56, h: 56, zone: 'floor' },
  { type: 'painting', label: 'Painting', emoji: '🖼️', w: 58, h: 50, zone: 'wall' },
  { type: 'guitar', label: 'Guitar', emoji: '🎸', w: 46, h: 60, zone: 'floor' },
]

export const ALBUM_SIZE = 56

export const getCatalogItem = (type: FurnitureType): CatalogItem =>
  FURNITURE_CATALOG.find(c => c.type === type) ?? {
    type: 'album',
    label: 'Album',
    emoji: '💿',
    w: ALBUM_SIZE,
    h: ALBUM_SIZE,
    zone: 'wall',
  }

export const POSTER_COLORS = [w.jasperRed, w.benzolGreen, w.orangeYellow, w.cerulianBlue, w.rosolancPurple, w.yellowOcher, w.hermosaPink]

export const clampToRoom = (x: number, y: number, w = 40, h = 40) => ({
  x: Math.min(ROOM_W - w / 2, Math.max(w / 2, x)),
  y: Math.min(ROOM_H - h / 2, Math.max(h / 2, y)),
})

/** Pick the emptiest spot in an item's natural zone (wall or floor), away from what's already there. */
export const spawnPoint = (zone: 'wall' | 'floor', existing: { x: number; y: number }[] = []) => {
  const margin = 50
  const candidate = () =>
    zone === 'wall'
      ? { x: margin + Math.random() * (ROOM_W - margin * 2), y: 45 + Math.random() * (WALL_H - 90) }
      : { x: margin + Math.random() * (ROOM_W - margin * 2), y: WALL_H + 45 + Math.random() * (ROOM_H - WALL_H - 90) }
  let best = candidate()
  let bestScore = -1
  for (let i = 0; i < 24; i++) {
    const c = candidate()
    const nearest = existing.reduce((m, e) => Math.min(m, Math.hypot(e.x - c.x, e.y - c.y)), Infinity)
    if (nearest > bestScore) {
      best = c
      bestScore = nearest
    }
  }
  return best
}
