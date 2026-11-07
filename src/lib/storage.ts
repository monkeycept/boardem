import { createJSONStorage, StateStorage } from 'zustand/middleware'

/** localStorage that never throws (private mode, blocked storage, embedded previews). */
const memory = new Map<string, string>()

const safeLocalStorage: StateStorage = {
  getItem: key => {
    try {
      return window.localStorage.getItem(key)
    } catch {
      return memory.get(key) ?? null
    }
  },
  setItem: (key, value) => {
    try {
      window.localStorage.setItem(key, value)
    } catch {
      memory.set(key, value)
    }
  },
  removeItem: key => {
    try {
      window.localStorage.removeItem(key)
    } catch {
      memory.delete(key)
    }
  },
}

export const persistStorage = createJSONStorage(() => safeLocalStorage)
