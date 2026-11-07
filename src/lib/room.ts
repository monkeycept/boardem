import { FurnitureType } from '../types'

/** Every loft is laid out in the same logical room, then scaled to fit the screen. */
export const ROOM_W = 460
export const ROOM_H = 380
export const WALL_H = 150

export interface Wallpaper {
  id: string
  label: string
  top: string
  bottom: string
  accent: string
}

export const WALLPAPERS: Wallpaper[] = [
  { id: 'dark-purple', label: 'Midnight', top: '#3b1d6e', bottom: '#5b21b6', accent: '#c4b5fd' },
  { id: 'deep-blue', label: 'Deep Blue', top: '#0b1e4a', bottom: '#1e3a8a', accent: '#93c5fd' },
  { id: 'dark-neon', label: 'Neon', top: '#0a0f1f', bottom: '#1a1033', accent: '#22d3ee' },
  { id: 'warm-brown', label: 'Cabin', top: '#3d2412', bottom: '#6b3f1d', accent: '#fbbf24' },
  { id: 'forest-green', label: 'Forest', top: '#0c2e25', bottom: '#14532d', accent: '#6ee7b7' },
  { id: 'light-gray', label: 'Gallery', top: '#334155', bottom: '#475569', accent: '#e2e8f0' },
  { id: 'pastel-pink', label: 'Sunset', top: '#4c0d2e', bottom: '#9d174d', accent: '#f9a8d4' },
  { id: 'ocean-blue', label: 'Ocean', top: '#06283d', bottom: '#0e7490', accent: '#67e8f9' },
]

export interface Floor {
  id: string
  label: string
  base: string
  line: string
  pattern: 'planks' | 'tiles' | 'grid' | 'checker' | 'plain' | 'mats'
}

export const FLOORS: Floor[] = [
  { id: 'wood', label: 'Oak', base: '#5c3d22', line: '#3f2915', pattern: 'planks' },
  { id: 'marble', label: 'Marble', base: '#cbd5e1', line: '#94a3b8', pattern: 'tiles' },
  { id: 'neon-grid', label: 'Neon Grid', base: '#0b0b1a', line: '#d946ef', pattern: 'grid' },
  { id: 'carpet', label: 'Carpet', base: '#1e3a5f', line: '#1e3a5f', pattern: 'plain' },
  { id: 'moss', label: 'Moss', base: '#2f4f2f', line: '#3f6b3f', pattern: 'plain' },
  { id: 'retro-tile', label: 'Retro', base: '#f5d0c5', line: '#be185d', pattern: 'checker' },
  { id: 'concrete', label: 'Concrete', base: '#3f3f46', line: '#52525b', pattern: 'tiles' },
  { id: 'tatami', label: 'Tatami', base: '#a3a35a', line: '#6b6b2e', pattern: 'mats' },
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

export const POSTER_COLORS = ['#22d3ee', '#a855f7', '#f472b6', '#facc15', '#34d399', '#fb923c']

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
