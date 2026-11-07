import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { FurnitureItem, FurnitureType, NowPlaying } from '../types'
import { persistStorage } from '../lib/storage'
import { clampToRoom, getCatalogItem, POSTER_COLORS, spawnPoint } from '../lib/room'
import { uid } from '../lib/ids'

interface LoftState {
  furniture: FurnitureItem[]
  wallpaper: string
  flooring: string
  nowPlaying: NowPlaying | null
  selectedId: string | null
  savedAt: number | null

  addItem: (type: FurnitureType, extra?: Partial<FurnitureItem>) => string
  updateItem: (id: string, updates: Partial<FurnitureItem>) => void
  moveItem: (id: string, x: number, y: number) => void
  rotateItem: (id: string) => void
  resizeItem: (id: string, delta: number) => void
  bringForward: (id: string) => void
  removeItem: (id: string) => void
  select: (id: string | null) => void
  clear: () => void
  setWallpaper: (id: string) => void
  setFlooring: (id: string) => void
  setNowPlaying: (np: NowPlaying | null) => void
  markSaved: () => void
}

const STARTER: FurnitureItem[] = [
  { id: 'starter-bed', type: 'bed', x: 330, y: 290, rotation: 0, scale: 1, zIndex: 1 },
  { id: 'starter-plant', type: 'plant', x: 70, y: 210, rotation: 0, scale: 1, zIndex: 2 },
  { id: 'starter-album', type: 'album', x: 230, y: 70, rotation: 0, scale: 1, zIndex: 3, trackId: 'vinyl-groove' },
]

const topZ = (items: FurnitureItem[]) => items.reduce((m, i) => Math.max(m, i.zIndex), 0)

export const useLoftStore = create<LoftState>()(
  persist(
    (set, get) => ({
      furniture: STARTER,
      wallpaper: 'dark-purple',
      flooring: 'wood',
      nowPlaying: null,
      selectedId: null,
      savedAt: null,

      addItem: (type, extra = {}) => {
        const cat = getCatalogItem(type)
        const pos = spawnPoint(cat.zone, get().furniture)
        const id = uid(type)
        const item: FurnitureItem = {
          id,
          type,
          ...clampToRoom(pos.x, pos.y, cat.w, cat.h),
          rotation: 0,
          scale: 1,
          // Rugs go underneath everything else.
          zIndex: type === 'rug' ? Math.min(0, ...get().furniture.map(f => f.zIndex)) - 1 : topZ(get().furniture) + 1,
          color: type === 'poster' || type === 'rug' ? POSTER_COLORS[Math.floor(Math.random() * POSTER_COLORS.length)] : undefined,
          ...extra,
        }
        set({ furniture: [...get().furniture, item], selectedId: id })
        return id
      },
      updateItem: (id, updates) =>
        set({ furniture: get().furniture.map(f => (f.id === id ? { ...f, ...updates } : f)) }),
      moveItem: (id, x, y) => {
        const item = get().furniture.find(f => f.id === id)
        if (!item) return
        const cat = getCatalogItem(item.type)
        get().updateItem(id, clampToRoom(x, y, cat.w * item.scale * 0.5, cat.h * item.scale * 0.5))
      },
      rotateItem: id => {
        const item = get().furniture.find(f => f.id === id)
        if (item) get().updateItem(id, { rotation: (item.rotation + 45) % 360 })
      },
      resizeItem: (id, delta) => {
        const item = get().furniture.find(f => f.id === id)
        if (item) get().updateItem(id, { scale: Math.min(2, Math.max(0.5, +(item.scale + delta).toFixed(2))) })
      },
      bringForward: id => get().updateItem(id, { zIndex: topZ(get().furniture) + 1 }),
      removeItem: id =>
        set({
          furniture: get().furniture.filter(f => f.id !== id),
          selectedId: get().selectedId === id ? null : get().selectedId,
        }),
      select: id => set({ selectedId: id }),
      clear: () => set({ furniture: [], selectedId: null }),
      setWallpaper: wallpaper => set({ wallpaper }),
      setFlooring: flooring => set({ flooring }),
      setNowPlaying: nowPlaying => set({ nowPlaying }),
      markSaved: () => set({ savedAt: Date.now() }),
    }),
    {
      name: 'skyloft-loft',
      storage: persistStorage,
      version: 2,
      partialize: s => ({ furniture: s.furniture, wallpaper: s.wallpaper, flooring: s.flooring, nowPlaying: s.nowPlaying, savedAt: s.savedAt }),
    },
  ),
)
