import { create } from 'zustand'

type CurrentPage = 'scanner' | 'home' | 'loft' | 'passengers' | 'chat'

interface UserState {
  userId: string | null
  userName: string | null
  userAvatar: string | null
  flightCode: string | null

  setUserId: (id: string) => void
  setUserName: (name: string) => void
  setUserAvatar: (avatar: string) => void
  setFlightCode: (code: string) => void

  currentPage: CurrentPage
  setCurrentPage: (page: CurrentPage) => void

  hasSeenTutorial: boolean
  setHasSeenTutorial: (seen: boolean) => void
}

export const useUserStore = create<UserState>((set) => ({
  userId: null,
  userName: null,
  userAvatar: null,
  flightCode: null,

  setUserId: (id) => set({ userId: id }),
  setUserName: (name) => set({ userName: name }),
  setUserAvatar: (avatar) => set({ userAvatar: avatar }),
  setFlightCode: (code) => set({ flightCode: code }),

  currentPage: 'scanner',
  setCurrentPage: (page) => set({ currentPage: page }),

  hasSeenTutorial: false,
  setHasSeenTutorial: (seen) => set({ hasSeenTutorial: seen }),
}))
