import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Page } from '../types'
import { persistStorage } from '../lib/storage'

export const AVATARS = ['🧑‍✈️', '👩‍💻', '🧑‍🎤', '👨‍🎨', '🧑‍🚀', '👩‍🔬', '🦊', '🐼', '🐸', '🦄', '🐙', '🤖']

interface UserState {
  name: string
  avatar: string
  page: Page
  cabinHum: boolean
  celebratedSave: boolean
  visitedLofts: string[]
  lastChatSeenAt: number

  setProfile: (name: string, avatar: string) => void
  setPage: (page: Page) => void
  setCabinHum: (on: boolean) => void
  markSaveCelebrated: () => void
  markVisited: (loftId: string) => boolean
  markChatSeen: () => void
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      name: '',
      avatar: AVATARS[0],
      page: 'home',
      cabinHum: true,
      celebratedSave: false,
      visitedLofts: [],
      lastChatSeenAt: 0,

      setProfile: (name, avatar) => set({ name, avatar }),
      setPage: page => set(page === 'chat' ? { page, lastChatSeenAt: Date.now() } : { page }),
      setCabinHum: on => set({ cabinHum: on }),
      markSaveCelebrated: () => set({ celebratedSave: true }),
      /** Returns true the first time a loft is visited. */
      markVisited: loftId => {
        if (get().visitedLofts.includes(loftId)) return false
        set({ visitedLofts: [...get().visitedLofts, loftId] })
        return true
      },
      markChatSeen: () => set({ lastChatSeenAt: Date.now() }),
    }),
    { name: 'skyloft-user', storage: persistStorage, version: 2 },
  ),
)
