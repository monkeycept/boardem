import { create } from 'zustand'
import { FurnitureItem } from '../types/index'

interface LoftBuilderState {
  // Furniture
  furniture: FurnitureItem[]
  selectedItemId: string | null

  // Actions
  addFurniture: (item: FurnitureItem) => void
  removeFurniture: (id: string) => void
  updateFurniture: (id: string, updates: Partial<FurnitureItem>) => void
  selectItem: (id: string | null) => void
  clearFurniture: () => void

  // Decorations
  wallpaper: string
  setWallpaper: (wallpaper: string) => void

  // Music
  currentTrackId: string | null
  setCurrentTrackId: (id: string | null) => void
  isPlaying: boolean
  setIsPlaying: (playing: boolean) => void
}

export const useLoftStore = create<LoftBuilderState>((set) => ({
  furniture: [],
  selectedItemId: null,

  addFurniture: (item) => set((state) => ({
    furniture: [...state.furniture, item]
  })),

  removeFurniture: (id) => set((state) => ({
    furniture: state.furniture.filter(f => f.id !== id),
    selectedItemId: state.selectedItemId === id ? null : state.selectedItemId
  })),

  updateFurniture: (id, updates) => set((state) => ({
    furniture: state.furniture.map(f => f.id === id ? { ...f, ...updates } : f)
  })),

  selectItem: (id) => set({ selectedItemId: id }),

  clearFurniture: () => set({ furniture: [], selectedItemId: null }),

  wallpaper: 'dark-purple',
  setWallpaper: (wallpaper) => set({ wallpaper }),

  currentTrackId: null,
  setCurrentTrackId: (id) => set({ currentTrackId: id }),

  isPlaying: false,
  setIsPlaying: (playing) => set({ isPlaying: playing }),
}))
