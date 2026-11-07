import { create } from 'zustand'
import { Flight, Passenger, Loft, ChatMessage } from '../types/index'
import { demosPassengers, demoLofts } from '../lib/demo-data'

interface FlightState {
  // Flight info
  currentFlight: Flight | null
  setCurrentFlight: (flight: Flight) => void

  // Passengers
  passengers: Passenger[]
  setPassengers: (passengers: Passenger[]) => void
  addPassenger: (passenger: Passenger) => void
  removePassenger: (id: string) => void

  // Lofts
  lofts: Record<string, Loft>
  setLofts: (lofts: Record<string, Loft>) => void
  updateLoft: (loft: Loft) => void

  // Chat
  messages: ChatMessage[]
  addMessage: (message: ChatMessage) => void
  setMessages: (messages: ChatMessage[]) => void

  // Current user
  currentUserId: string | null
  setCurrentUserId: (id: string) => void

  // Visiting
  visitingLoftId: string | null
  setVisitingLoftId: (id: string | null) => void

  // Demo mode
  useDemoMode: boolean
  setUseDemoMode: (use: boolean) => void
  initializeDemoData: () => void
}

export const useFlightStore = create<FlightState>((set) => ({
  currentFlight: null,
  setCurrentFlight: (flight) => set({ currentFlight: flight }),

  passengers: [],
  setPassengers: (passengers) => set({ passengers }),
  addPassenger: (passenger) => set((state) => ({
    passengers: [...state.passengers, passenger]
  })),
  removePassenger: (id) => set((state) => ({
    passengers: state.passengers.filter(p => p.id !== id)
  })),

  lofts: {},
  setLofts: (lofts) => set({ lofts }),
  updateLoft: (loft) => set((state) => ({
    lofts: { ...state.lofts, [loft.id]: loft }
  })),

  messages: [],
  addMessage: (message) => set((state) => ({
    messages: [...state.messages, message]
  })),
  setMessages: (messages) => set({ messages }),

  currentUserId: null,
  setCurrentUserId: (id) => set({ currentUserId: id }),

  visitingLoftId: null,
  setVisitingLoftId: (id) => set({ visitingLoftId: id }),

  useDemoMode: false,
  setUseDemoMode: (use) => set({ useDemoMode: use }),

  initializeDemoData: () => set({
    passengers: demosPassengers,
    lofts: demoLofts,
    useDemoMode: true
  }),
}))
