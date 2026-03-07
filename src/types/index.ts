export interface Flight {
  flightNumber: string
  departureAirport: string
  arrivalAirport: string
  departureTime: string
  arrivalTime: string
  date: string
  seatNumber: string
  passengerName: string
  airline: string
}

export interface User {
  id: string
  name: string
  avatar: string
  status: 'online' | 'offline'
  lastSeen?: number
  currentLoft?: string
}

export interface FurnitureItem {
  id: string
  type: 'bed' | 'couch' | 'desk' | 'plant' | 'lamp' | 'rug' | 'speaker' | 'tv' | 'poster' | 'shelf' | 'painting' | 'guitar'
  x: number
  y: number
  rotation: number
  scale: number
  zIndex: number
  color?: string
  imageUrl?: string
}

export interface Loft {
  id: string
  ownerId: string
  ownerName: string
  flightCode: string
  furniture: FurnitureItem[]
  wallpaper: string
  flooring: string
  currentlyPlaying?: {
    title: string
    artist: string
    url: string
    duration: number
  }
  createdAt: number
  updatedAt: number
}

export interface ChatMessage {
  id: string
  senderId: string
  senderName: string
  senderAvatar: string
  text: string
  timestamp: number
  loftId?: string
  isSystemMessage?: boolean
}

export interface Passenger {
  id: string
  name: string
  avatar: string
  status: 'online' | 'offline'
  loftId: string
  currentlyVisiting?: string
  joinedAt: number
}

export interface Album {
  id: string
  title: string
  artist: string
  imageUrl: string
  audioUrl: string
  duration: number
}

export interface VisitorData {
  id: string
  name: string
  avatar: string
  x: number
  y: number
  visiting: string
}
```

<file_path>
sandship/src/lib/firebase.ts
</file_path>

<edit_description>
Create Firebase configuration and helpers
</edit_description>

```
import { initializeApp } from 'firebase/app'
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore'
import { getAuth, connectAuthEmulator, signInAnonymously } from 'firebase/auth'

// Initialize Firebase with environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyDemoKey123456789',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'demo.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'skyloft-demo',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'skyloft-demo.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '123456789',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:123456789:web:abcdef123456'
}

export const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
export const auth = getAuth(app)

// Sign in anonymously
export const initializeAuth = async () => {
  try {
    const result = await signInAnonymously(auth)
    return result.user
  } catch (error) {
    console.error('Auth error:', error)
    throw error
  }
}

// Helper functions
export const getFlightCode = (flightNumber: string): string => {
  return flightNumber.toUpperCase().replace(/\s/g, '')
}

export const generateLoftId = (userId: string, flightCode: string): string => {
  return `${userId}-${flightCode}`
}

export const generateChatId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

export const generatePassengerId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}
```

<file_path>
sandship/src/lib/demo-data.ts
</file_path>

<edit_description>
Create demo data with 8 unique passenger profiles
</edit_description>

```
import { Passenger, Loft, FurnitureItem } from '../types/index'

const demoAvatars = [
  '👩‍💻', // Amara
  '👨‍🎓', // Marcus
  '👩‍🎨', // Zara
  '👨‍🎮', // Kai
  '👩‍🎵', // Nova
  '👨‍🌾', // River
  '👩‍🚀', // Sienna
  '👨‍✈️'  // Atlas
]

const createFurniture = (items: Array<{ type: FurnitureItem['type'], x: number, y: number, rotation?: number, scale?: number, color?: string }>): FurnitureItem[] => {
  return items.map((item, idx) => ({
    id: `furniture-${idx}`,
    type: item.type,
    x: item.x,
    y: item.y,
    rotation: item.rotation || 0,
    scale: item.scale || 1,
    zIndex: idx,
    color: item.color,
  }))
}

export const demosPassengers: Passenger[] = [
  {
    id: 'demo-1',
    name: 'Amara',
    avatar: demoAvatars[0],
    status: 'online',
    loftId: 'loft-1',
    joinedAt: Date.now() - 300000,
  },
  {
    id: 'demo-2',
    name: 'Marcus',
    avatar: demoAvatars[1],
    status: 'online',
    loftId: 'loft-2',
    joinedAt: Date.now() - 600000,
  },
  {
    id: 'demo-3',
    name: 'Zara',
    avatar: demoAvatars[2],
    status: 'online',
    loftId: 'loft-3',
    joinedAt: Date.now() - 900000,
  },
  {
    id: 'demo-4',
    name: 'Kai',
    avatar: demoAvatars[3],
    status: 'online',
    loftId: 'loft-4',
    joinedAt: Date.now() - 1200000,
  },
  {
    id: 'demo-5',
    name: 'Nova',
    avatar: demoAvatars[4],
    status: 'online',
    loftId: 'loft-5',
    joinedAt: Date.now() - 1500000,
  },
  {
    id: 'demo-6',
    name: 'River',
    avatar: demoAvatars[5],
    status: 'online',
    loftId: 'loft-6',
    joinedAt: Date.now() - 1800000,
  },
  {
    id: 'demo-7',
    name: 'Sienna',
    avatar: demoAvatars[6],
    status: 'online',
    loftId: 'loft-7',
    joinedAt: Date.now() - 2100000,
  },
  {
    id: 'demo-8',
    name: 'Atlas',
    avatar: demoAvatars[7],
    status: 'offline',
    loftId: 'loft-8',
    joinedAt: Date.now() - 2400000,
  },
]

export const demoLofts: Record<string, Loft> = {
  'loft-1': {
    id: 'loft-1',
    ownerId: 'demo-1',
    ownerName: 'Amara',
    flightCode: 'AA123',
    wallpaper: 'dark-purple',
    flooring: 'neon-grid',
    furniture: createFurniture([
      { type: 'bed', x: 50, y: 150, scale: 1.2 },
      { type: 'desk', x: 200, y: 100 },
      { type: 'lamp', x: 280, y: 80, color: 'cyan' },
      { type: 'poster', x: 50, y: 20 },
      { type: 'speaker', x: 250, y: 300 },
      { type: 'plant', x: 400, y: 200 },
    ]),
    currentlyPlaying: {
      title: 'Midnight Code',
      artist: 'Synthwave Dreams',
      url: '/tracks/synthwave.mp3',
      duration: 240
    },
    createdAt: Date.now() - 300000,
    updatedAt: Date.now(),
  },
  'loft-2': {
    id: 'loft-2',
    ownerId: 'demo-2',
    ownerName: 'Marcus',
    flightCode: 'AA123',
    wallpaper: 'warm-brown',
    flooring: 'wood',
    furniture: createFurniture([
      { type: 'couch', x: 80, y: 180, scale: 1.1 },
      { type: 'desk', x: 280, y: 120 },
      { type: 'shelf', x: 400, y: 100 },
      { type: 'plant', x: 100, y: 80 },
      { type: 'plant', x: 350, y: 200 },
      { type: 'lamp', x: 320, y: 150, color: 'warm' },
      { type: 'rug', x: 150, y: 200 },
    ]),
    currentlyPlaying: {
      title: 'Autumn Breeze',
      artist: 'Indie Folk',
      url: '/tracks/indie.mp3',
      duration: 300
    },
    createdAt: Date.now() - 600000,
    updatedAt: Date.now(),
  },
  'loft-3': {
    id: 'loft-3',
    ownerId: 'demo-3',
    ownerName: 'Zara',
    flightCode: 'AA123',
    wallpaper: 'light-gray',
    flooring: 'marble',
    furniture: createFurniture([
      { type: 'bed', x: 60, y: 200 },
      { type: 'painting', x: 150, y: 50 },
      { type: 'poster', x: 250, y: 50 },
      { type: 'lamp', x: 350, y: 150, color: 'soft-white' },
    ]),
    currentlyPlaying: {
      title: 'Ambient Spaces',
      artist: 'Minimalist Sounds',
      url: '/tracks/ambient.mp3',
      duration: 600
    },
    createdAt: Date.now() - 900000,
    updatedAt: Date.now(),
  },
  'loft-4': {
    id: 'loft-4',
    ownerId: 'demo-4',
    ownerName: 'Kai',
    flightCode: 'AA123',
    wallpaper: 'dark-neon',
    flooring: 'rgb-lights',
    furniture: createFurniture([
      { type: 'desk', x: 100, y: 150, scale: 1.3 },
      { type: 'tv', x: 300, y: 100 },
      { type: 'poster', x: 50, y: 40 },
      { type: 'lamp', x: 350, y: 180, color: 'neon-purple' },
      { type: 'speaker', x: 200, y: 280 },
    ]),
    currentlyPlaying: {
      title: 'Digital Dreams',
      artist: 'Synthwave Vibes',
      url: '/tracks/synthwave.mp3',
      duration: 280
    },
    createdAt: Date.now() - 1200000,
    updatedAt: Date.now(),
  },
  'loft-5': {
    id: 'loft-5',
    ownerId: 'demo-5',
    ownerName: 'Nova',
    flightCode: 'AA123',
    wallpaper: 'deep-blue',
    flooring: 'vinyl',
    furniture: createFurniture([
      { type: 'desk', x: 150, y: 120 },
      { type: 'speaker', x: 280, y: 180, scale: 1.2 },
      { type: 'poster', x: 60, y: 60 },
      { type: 'poster', x: 250, y: 60 },
      { type: 'poster', x: 340, y: 60 },
      { type: 'lamp', x: 400, y: 200 },
    ]),
    currentlyPlaying: {
      title: 'Vinyl Groove',
      artist: 'Chill Hop Beats',
      url: '/tracks/chillhop.mp3',
      duration: 220
    },
    createdAt: Date.now() - 1500000,
    updatedAt: Date.now(),
  },
  'loft-6': {
    id: 'loft-6',
    ownerId: 'demo-6',
    ownerName: 'River',
    flightCode: 'AA123',
    wallpaper: 'forest-green',
    flooring: 'moss',
    furniture: createFurniture([
      { type: 'bed', x: 80, y: 180 },
      { type: 'plant', x: 50, y: 80 },
      { type: 'plant', x: 150, y: 120 },
      { type: 'plant', x: 300, y: 100 },
      { type: 'painting', x: 200, y: 40 },
      { type: 'lamp', x: 350, y: 200, color: 'warm-green' },
    ]),
    currentlyPlaying: {
      title: 'Nature Sounds',
      artist: 'Forest Ambient',
      url: '/tracks/nature.mp3',
      duration: 480
    },
    createdAt: Date.now() - 1800000,
    updatedAt: Date.now(),
  },
  'loft-7': {
    id: 'loft-7',
    ownerId: 'demo-7',
    ownerName: 'Sienna',
    flightCode: 'AA123',
    wallpaper: 'pastel-pink',
    flooring: 'retro-tile',
    furniture: createFurniture([
      { type: 'couch', x: 100, y: 200, scale: 1.1 },
      { type: 'lamp', x: 80, y: 120, color: 'neon-pink' },
      { type: 'poster', x: 200, y: 50 },
      { type: 'poster', x: 280, y: 50 },
      { type: 'speaker', x: 320, y: 180 },
      { type: 'plant', x: 350, y: 240 },
    ]),
    currentlyPlaying: {
      title: 'Retro Vibes',
      artist: '80s Synthpop',
      url: '/tracks/synthpop.mp3',
      duration: 260
    },
    createdAt: Date.now() - 2100000,
    updatedAt: Date.now(),
  },
  'loft-8': {
    id: 'loft-8',
    ownerId: 'demo-8',
    ownerName: 'Atlas',
    flightCode: 'AA123',
    wallpaper: 'ocean-blue',
    flooring: 'compass',
    furniture: createFurniture([
      { type: 'desk', x: 120, y: 140 },
      { type: 'painting', x: 60, y: 50 },
      { type: 'poster', x: 200, y: 50 },
      { type: 'poster', x: 300, y: 50 },
      { type: 'shelf', x: 350, y: 180 },
      { type: 'guitar', x: 400, y: 250 },
    ]),
    currentlyPlaying: {
      title: 'World Music Mix',
      artist: 'Global Sounds',
      url: '/tracks/world.mp3',
      duration: 360
    },
    createdAt: Date.now() - 2400000,
    updatedAt: Date.now(),
  },
}

export const demoTracks = [
  { id: 'track-1', title: 'Midnight Code', artist: 'Synthwave Dreams', duration: 240 },
  { id: 'track-2', title: 'Autumn Breeze', artist: 'Indie Folk', duration: 300 },
  { id: 'track-3', title: 'Ambient Spaces', artist: 'Minimalist', duration: 600 },
  { id: 'track-4', title: 'Digital Dreams', artist: 'Synthwave', duration: 280 },
  { id: 'track-5', title: 'Vinyl Groove', artist: 'Chill Hop', duration: 220 },
  { id: 'track-6', title: 'Nature Sounds', artist: 'Forest Ambient', duration: 480 },
]

export const demoFlight = {
  flightNumber: 'AA123',
  departureAirport: 'SFO',
  arrivalAirport: 'JFK',
  departureTime: '09:00 AM',
  arrivalTime: '05:30 PM',
  date: new Date().toLocaleDateString(),
  seatNumber: '12A',
  passengerName: 'You',
  airline: 'American Airlines'
}
```

<file_path>
sandship/src/styles/globals.css
</file_path>

<edit_description>
Create global styles with Tailwind and custom animations
</edit_description>

```
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: rgba(51, 65, 85, 0.3);
  border-radius: 10px;
}

::-webkit-scrollbar-thumb {
  background: rgba(34, 211, 238, 0.5);
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(34, 211, 238, 0.8);
}

/* Glassmorphism */
.glass {
  @apply bg-slate-800/40 backdrop-blur-md border border-slate-700/50;
}

.glass-dark {
  @apply bg-slate-950/60 backdrop-blur-lg border border-slate-700/30;
}

/* Glow effects */
.glow-cyan {
  @apply shadow-lg shadow-cyan-500/50;
}

.glow-cyan-sm {
  @apply shadow-md shadow-cyan-500/30;
}

/* Gradient backgrounds */
.bg-sky-gradient {
  @apply bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900;
}

.bg-night-gradient {
  @apply bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900;
}

/* Text effects */
.text-glow {
  @apply text-cyan-300 drop-shadow-lg drop-shadow-cyan-500/50;
}

/* Animation utilities */
.animate-float {
  @apply animate-float;
}

.animate-glow {
  @apply animate-glow;
}

/* Button styles */
.btn-primary {
  @apply px-4 py-2 bg-cyan-500 text-slate-900 font-semibold rounded-lg hover:bg-cyan-400 transition-colors active:scale-95;
}

.btn-secondary {
  @apply px-4 py-2 bg-slate-700 text-cyan-300 font-semibold rounded-lg hover:bg-slate-600 transition-colors active:scale-95;
}

.btn-ghost {
  @apply px-4 py-2 text-cyan-300 hover:bg-slate-700/50 rounded-lg transition-colors active:scale-95;
}

/* Input styles */
.input-base {
  @apply w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20;
}

/* Card styles */
.card {
  @apply glass p-4 rounded-xl;
}

.card-dark {
  @apply glass-dark p-4 rounded-xl;
}

/* Safe area for notch devices */
@supports (padding: max(0px)) {
  body {
    padding-top: max(0px, env(safe-area-inset-top));
    padding-left: max(0px, env(safe-area-inset-left));
    padding-right: max(0px, env(safe-area-inset-right));
    padding-bottom: max(0px, env(safe-area-inset-bottom));
  }
}

/* Prevent bounce scroll on iOS */
html, body {
  position: fixed;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

#root {
  width: 100%;
  height: 100%;
  overflow: auto;
}

/* Loading spinner */
.spinner {
  @apply inline-block w-4 h-4 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin;
}

/* Floating labels */
.floating-label {
  @apply absolute text-cyan-300 text-xs font-medium opacity-0 transition-all duration-200;
}

input:focus ~ .floating-label,
input:not(:placeholder-shown) ~ .floating-label {
  @apply -top-6 opacity-100;
}
```

<file_path>
sandship/src/main.tsx
</file_path>

<edit_description>
Create React entry point
</edit_description>

```
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './styles/globals.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

<file_path>
sandship/src/vite-env.d.ts
</file_path>

<edit_description>
Create Vite environment type definitions
</edit_description>

```
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_FIREBASE_API_KEY: string
  readonly VITE_FIREBASE_AUTH_DOMAIN: string
  readonly VITE_FIREBASE_PROJECT_ID: string
  readonly VITE_FIREBASE_STORAGE_BUCKET: string
  readonly VITE_FIREBASE_MESSAGING_SENDER_ID: string
  readonly VITE_FIREBASE_APP_ID: string
  readonly VITE_FIREBASE_MEASUREMENT_ID?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
```

<file_path>
sandship/src/stores/flightStore.ts
</file_path>

<edit_description>
Create Zustand store for flight and passenger data
</edit_description>

```
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
```

<file_path>
sandship/src/stores/loftStore.ts
</file_path>

<edit_description>
Create Zustand store for loft builder state
</edit_description>

```
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
```

<file_path>
sandship/src/stores/userStore.ts
</file_path>

<edit_description>
Create Zustand store for user data
</edit_description>

```
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
```

<file_path>
sandship/src/App.tsx
</file_path>

<edit_description>
Create main App component with routing logic
</edit_description>

```
import React, { useEffect } from 'react'
import { useUserStore } from './stores/userStore'
import { useFlightStore } from './stores/flightStore'
import { initializeAuth } from './lib/firebase'
import ScannerScreen from './components/screens/ScannerScreen'
import HomeScreen from './components/screens/HomeScreen'
import LoftBuilderScreen from './components/screens/LoftBuilderScreen'
import PassengersScreen from './components/screens/PassengersScreen'
import ChatScreen from './components/screens/ChatScreen'
import VisitLoftScreen from './components/screens/VisitLoftScreen'
import Layout from './components/layout/Layout'
import Confetti from './components/common/Confetti'

export default function App() {
  const { currentPage, flightCode } = useUserStore()
  const { visitingLoftId } = useFlightStore()

  useEffect(() => {
    // Initialize Firebase auth
    const initAuth = async () => {
      try {
        await initializeAuth()
      } catch (error) {
        console.error('Failed to initialize auth:', error)
      }
    }
    initAuth()
  }, [])

  // If not boarded yet, show scanner
  if (!flightCode) {
    return (
      <div className="w-full h-full bg-slate-900">
        <ScannerScreen />
      </div>
    )
  }

  // If visiting a loft, show visitor mode
  if (visitingLoftId) {
    return (
      <div className="w-full h-full bg-slate-900">
        <VisitLoftScreen />
        <Confetti />
      </div>
    )
  }

  // Otherwise show main layout with navigation
  return (
    <Layout>
      {currentPage === 'home' && <HomeScreen />}
      {currentPage === 'loft' && <LoftBuilderScreen />}
      {currentPage === 'passengers' && <PassengersScreen />}
      {currentPage === 'chat' && <ChatScreen />}
      <Confetti />
    </Layout>
  )
}
```

<file_path>
sandship/src/components/layout/Header.tsx
</file_path>

<edit_description>
Create header component with flight info
</edit_description>

```
import React from 'react'
import { useUserStore } from '../../stores/userStore'
import { Plane } from 'lucide-react'

export default function Header() {
  const { userName, flightCode } = useUserStore()

  return (
    <div className="glass border-b border-slate-700/50 px-4 py-3 flex items-center justify-between sticky top-0 z-20">
      <div className="flex items-center gap-2">
        <Plane className="w-5 h-5 text-cyan-400" />
        <div>
          <h1 className="text-lg font-bold text-cyan-300">SkyLoft</h1>
          {flightCode && (
            <p className="text-xs text-slate-400">{flightCode}</p>
          )}
        </div>
      </div>

      <div className="text-right">
        {userName && (
          <p className="text-sm font-medium text-slate-100">{userName}</p>
        )}
        <p className="text-xs text-slate-400">✈️ Cruising</p>
      </div>
    </div>
  )
}
```

<file_path>
sandship/src/components/layout/Layout.tsx
</file_path>

<edit_description>
Create main layout with bottom navigation
</edit_description>

```
import React from 'react'
import BottomNav from './BottomNav'
import Header from './Header'

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="w-full h-full flex flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
      {/* Header */}
      <Header />

      {/* Main content */}
      <div className="flex-1 overflow-y-auto">
        {children}
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  )
}
```

<file_path>
sandship/src/components/layout/BottomNav.tsx
</file_path>

<edit_description>
Create bottom navigation with 4 main screens
</edit_description>

```
import React from 'react'
import { motion } from 'framer-motion'
import { useUserStore } from '../../stores/userStore'
import { Home, Zap, Users, MessageCircle } from 'lucide-react'

export default function BottomNav() {
  const { currentPage, setCurrentPage } = useUserStore()

  const navItems: Array<{ id: 'home' | 'loft' | 'passengers' | 'chat'; label: string; icon: React.ReactNode }> = [
    { id: 'home', label: 'Home', icon: <Home className="w-5 h-5" /> },
    { id: 'loft', label: 'My Loft', icon: <Zap className="w-5 h-5" /> },
    { id: 'passengers', label: 'Passengers', icon: <Users className="w-5 h-5" /> },
    { id: 'chat', label: 'Chat', icon: <MessageCircle className="w-5 h-5" /> },
  ]

  return (
    <div className="glass border-t border-slate-700/50 px-4 py-3 sticky bottom-0 z-20">
      <div className="grid grid-cols-4 gap-2">
        {navItems.map((item) => (
          <motion.button
            key={item.id}
            onClick={() => setCurrentPage(item.id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`flex flex-col items-center gap-1 py-2 px-3 rounded-lg transition-all ${
              currentPage === item.id
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50'
                : 'text-slate-400 hover:text-slate-300 hover:bg-slate-700/30'
            }`}
          >
            {item.icon}
            <span className="text-xs font-medium">{item.label}</span>
          </motion.button>
        ))}
      </div>
    </div>
  )
}
```

<file_path>
sandship/src/components/screens/ScannerScreen.tsx
</file_path>

<edit_description>
Create boarding pass QR code scanner screen
</edit_description>

```
import React, { useEffect, useRef, useState } from 'react'
import { Html5QrcodeScanner } from 'html5-qrcode'
import { motion } from 'framer-motion'
import { useUserStore } from '../../stores/userStore'
import { useFlightStore } from '../../stores/flightStore'
import { Plane, Camera, Zap } from 'lucide-react'
import { demoFlight, demosPassengers, demoLofts } from '../../lib/demo-data'
import toast from 'react-hot-toast'

export default function ScannerScreen() {
  const { setUserName, setFlightCode, setCurrentPage } = useUserStore()
  const { setCurrentFlight, initializeDemoData } = useFlightStore()
  const [scanning, setScanning] = useState(true)
  const [scanned, setScanned] = useState(false)
  const scannerRef = useRef<Html5QrcodeScanner | null>(null)

  useEffect(() => {
    if (!scanning || scanned) return

    const scanner = new Html5QrcodeScanner(
      'qr-reader',
      {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1,
        showTorchButtonIfSupported: true,
      },
      false
    )

    const onSuccess = (decodedText: string) => {
      const match = decodedText.match(/([A-Z]{2}\d{3,4})-(\d{1,2}[A-Z])/)

      if (match) {
        const flightNumber = match[1]
        const seatNumber = match[2]

        handleBoardingPass(flightNumber, seatNumber)
        setScanned(true)
        scanner.clear()
      }
    }

    const onError = () => {
      // Silent error
    }

    scanner.render(onSuccess, onError)
    scannerRef.current = scanner

    return () => {
      try {
        scanner.clear()
      } catch (e) {
        // Ignore cleanup errors
      }
    }
  }, [scanning, scanned])

  const handleBoardingPass = (flightNumber: string, seatNumber: string) => {
    setUserName('Passenger')
    setFlightCode(flightNumber)
    setCurrentFlight({
      flightNumber,
      seatNumber,
      departureAirport: 'SFO',
      arrivalAirport: 'JFK',
      departureTime: '09:00 AM',
      arrivalTime: '05:30 PM',
      date: new Date().toLocaleDateString(),
      passengerName: 'You',
      airline: 'American Airlines'
    })

    initializeDemoData()

    toast.success(`Welcome aboard ${flightNumber}!`, {
      duration: 2000,
      icon: '✈️'
    })

    setTimeout(() => {
      setCurrentPage('home')
    }, 1000)
  }

  const handleDemoMode = () => {
    setUserName(demoFlight.passengerName)
    setFlightCode(demoFlight.flightNumber)
    setCurrentFlight(demoFlight)
    initializeDemoData()

    toast.success(`Welcome aboard ${demoFlight.flightNumber}!`, {
      duration: 2000,
      icon: '✈️'
    })

    setTimeout(() => {
      setCurrentPage('home')
    }, 1000)
  }

  return (
    <div className="w-full h-full flex flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
      {/* Header */}
      <div className="p-6 text-center">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="flex items-center justify-center gap-3 mb-4"
        >
          <Plane className="w-8 h-8 text-cyan-400" />
          <h1 className="text-4xl font-bold text-cyan-300">SkyLoft</h1>
        </motion.div>

        <motion.p
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-slate-300 text-lg"
        >
          Your flying neighborhood awaits
        </motion.p>
      </div>

      {/* Scanner or Demo */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 gap-6">
        {scanning && !scanned ? (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="w-full max-w-sm"
          >
            <div className="glass rounded-2xl p-6 overflow-hidden">
              <div
                id="qr-reader"
                className="w-full"
                style={{ minHeight: '300px' }}
              />
              <div className="mt-4 text-center text-slate-400 text-sm">
                Point camera at boarding pass QR code
              </div>
            </div>
          </motion.div>
        ) : null}

        {/* Scanning indicator */}
        {scanning && !scanned && (
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex items-center gap-2 text-cyan-400"
          >
            <Camera className="w-5 h-5" />
            <span>Scanning...</span>
          </motion.div>
        )}
      </div>

      {/* Demo Mode Button */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="p-6 space-y-3"
      >
        <button
          onClick={handleDemoMode}
          className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-900 font-bold rounded-xl hover:shadow-lg hover:shadow-cyan-500/50 transition-all active:scale-95 flex items-center justify-center gap-2"
        >
          <Zap className="w-5 h-5" />
          Use Demo Flight
        </button>

        <p className="text-xs text-slate-400 text-center">
          Can't scan? Try demo mode to explore with 8 real passengers
        </p>
      </motion.div>
    </div>
  )
}
```

<file_path>
sandship/src/components/screens/HomeScreen.tsx
</file_path>

<edit_description>
Create home welcome screen
</edit_description>

```
import React from 'react'
import { motion } from 'framer-motion'
import { useUserStore } from '../../stores/userStore'
import { useFlightStore } from '../../stores/flightStore'
import { Users, Music, Zap, MessageSquare } from 'lucide-react'

export default function HomeScreen() {
  const { userName } = useUserStore()
  const { passengers } = useFlightStore()
  const onlineCount = passengers.filter(p => p.status === 'online').length

  const features = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'Design Your Loft',
      desc: 'Drag furniture, hang posters, set the vibe'
    },
    {
      icon: <Music className="w-6 h-6" />,
      title: 'Share Your Music',
      desc: 'Play your favorite tracks for visitors'
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: 'Visit Others',
      desc: 'Check out 8 unique passenger lofts'
    },
    {
      icon: <MessageSquare className="w-6 h-6" />,
      title: 'Chat & Vibe',
      desc: 'Float chat bubbles across lofts'
    },
  ]

  return (
    <div className="w-full h-full flex flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="p-6 text-center"
      >
        <h2 className="text-3xl font-bold text-cyan-300 mb-2">
          Welcome, {userName}! ✈️
        </h2>
        <p className="text-slate-300 text-lg mb-6">
          {onlineCount} passengers online on your flight
        </p>

        {/* Status cards */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="glass rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-cyan-400">{onlineCount}</div>
            <div className="text-xs text-slate-400">Online</div>
          </div>
          <div className="glass rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-cyan-400">8</div>
            <div className="text-xs text-slate-400">Lofts</div>
          </div>
          <div className="glass rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-cyan-400">🎵</div>
            <div className="text-xs text-slate-400">Vibing</div>
          </div>
        </div>
      </motion.div>

      {/* Features Grid */}
      <div className="flex-1 px-4 pb-4 overflow-y-auto">
        <div className="grid grid-cols-2 gap-3">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="glass rounded-xl p-4 text-center hover:border-cyan-500/50 transition-colors"
            >
              <div className="flex justify-center mb-2 text-cyan-400">
                {feature.icon}
              </div>
              <h3 className="font-bold text-slate-100 text-sm mb-1">
                {feature.title}
              </h3>
              <p className="text-xs text-slate-400">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-6 space-y-3"
        >
          <p className="text-slate-400 text-xs text-center mb-3">
            Pick a tab below to get started
          </p>
        </motion.div>
      </div>
    </div>
  )
}
```

<file_path>
sandship/src/components/screens/LoftBuilderScreen.tsx
</file_path>

<edit_description>
Create interactive loft builder with canvas
</edit_description>

```
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useLoftStore } from '../../stores/loftStore'
import { Palette, Save, Plus, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import LoftCanvas from '../loft/LoftCanvas'
import FurnitureInventory from '../loft/FurnitureInventory'

export default function LoftBuilderScreen() {
  const { furniture, wallpaper, setWallpaper } = useLoftStore()
  const [showInventory, setShowInventory] = useState(false)

  const wallpapers = [
    { id: 'dark-purple', label: 'Dark Purple', color: 'from-purple-900 to-slate-900' },
    { id: 'dark-blue', label: 'Dark Blue', color: 'from-blue-900 to-slate-800' },
    { id: 'dark-neon', label: 'Neon', color: 'from-slate-950 to-purple-950' },
    { id: 'warm-brown', label: 'Warm Brown', color: 'from-amber-900 to-slate-800' },
    { id: 'forest-green', label: 'Forest', color: 'from-green-900 to-slate-900' },
    { id: 'light-gray', label: 'Minimalist', color: 'from-slate-700 to-slate-800' },
    { id: 'pastel-pink', label: 'Pastel', color: 'from-rose-900 to-slate-800' },
    { id: 'ocean-blue', label: 'Ocean', color: 'from-cyan-900 to-slate-900' },
  ]

  const handleSave = () => {
    const loftData = {
      furniture,
      wallpaper,
      savedAt: new Date().toLocaleTimeString()
    }
    localStorage.setItem('loft', JSON.stringify(loftData))
    toast.success('Loft saved! 💾', { icon: '✨' })
  }

  return (
    <div className="w-full h-full flex flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Top Controls */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass border-b border-slate-700/50 p-4 flex items-center justify-between"
      >
        <div>
          <h2 className="font-bold text-cyan-300">My Loft</h2>
          <p className="text-xs text-slate-400">{furniture.length} items</p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setShowInventory(!showInventory)}
            className="btn-secondary flex items-center gap-1"
          >
            <Plus className="w-4 h-4" />
            Add
          </button>
          <button
            onClick={handleSave}
            className="btn-primary flex items-center gap-1"
          >
            <Save className="w-4 h-4" />
            Save
          </button>
        </div>
      </motion.div>

      {/* Wallpaper Selector */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="glass border-b border-slate-700/50 p-4"
      >
        <div className="flex items-center gap-2 mb-3">
          <Palette className="w-4 h-4 text-cyan-400" />
          <span className="text-sm font-medium text-slate-300">Wallpaper</span>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {wallpapers.map(wp => (
            <button
              key={wp.id}
              onClick={() => setWallpaper(wp.id)}
              className={`h-8 rounded-lg transition-all border-2 ${
                wallpaper === wp.id
                  ? 'border-cyan-400 ring-2 ring-cyan-500/50'
                  : 'border-slate-600 hover:border-cyan-400/50'
              } bg-gradient-to-br ${wp.color}`}
              title={wp.label}
            />
          ))}
        </div>
      </motion.div>

      {/* Canvas */}
      <div className="flex-1 overflow-hidden">
        <LoftCanvas wallpaper={wallpaper} />
      </div>

      {/* Inventory Sidebar */}
      {showInventory && (
        <motion.div
          initial={{ x: 300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 300, opacity: 0 }}
          className="absolute right-0 top-0 bottom-0 w-80 glass-dark border-l border-slate-700/50 overflow-y-auto z-40 shadow-2xl shadow-black/50"
        >
          <div className="p-4">
            <button
              onClick={() => setShowInventory(false)}
              className="ml-auto block text-slate-400 hover:text-slate-200"
            >
              ✕
            </button>
          </div>
          <FurnitureInventory />
        </motion.div>
      )}
    </div>
  )
}
```

<file_path>
sandship/src/components/loft/LoftCanvas.tsx
</file_path>

<edit_description>
Create interactive Konva canvas for loft
</edit_description>

```
import React, { useRef } from 'react'
import { Stage, Layer, Rect, Group, Text, Image as KonvaImage } from 'react-konva'
import { useLoftStore } from '../../stores/loftStore'
import FurnitureItemComponent from './FurnitureItem'
import Konva from 'konva'

interface LoftCanvasProps {
  wallpaper: string
}

const WALLPAPER_COLORS: Record<string, { bg: string; accent: string }> = {
  'dark-purple': { bg: '#6d28d9', accent: '#a78bfa' },
  'dark-blue': { bg: '#1e3a8a', accent: '#60a5fa' },
  'dark-neon': { bg: '#0a0f1f', accent: '#22d3ee' },
  'warm-brown': { bg: '#5d3a1a', accent: '#d97706' },
  'forest-green': { bg: '#134e4a', accent: '#10b981' },
  'light-gray': { bg: '#2d3748', accent: '#cbd5e1' },
  'pastel-pink': { bg: '#831843', accent: '#f472b6' },
  'ocean-blue': { bg: '#0c4a6e', accent: '#06b6d4' },
}

export default function LoftCanvas({ wallpaper }: LoftCanvasProps) {
  const { furniture, selectedItemId, selectItem, updateFurniture, removeFurniture } = useLoftStore()
  const stageRef = useRef<Konva.Stage>(null)
  const colors = WALLPAPER_COLORS[wallpaper] || WALLPAPER_COLORS['dark-purple']

  const handleStageClick = (e: any) => {
    if (e.target === e.target.getStage()) {
      selectItem(null)
    }
  }

  const handleItemDragEnd = (id: string, newPos: { x: number; y: number }) => {
    updateFurniture(id, { x: newPos.x, y: newPos.y })
  }

  const handleItemRotate = (id: string, rotation: number) => {
    updateFurniture(id, { rotation })
  }

  const stageWidth = typeof window !== 'undefined' ? window.innerWidth : 500
  const stageHeight = typeof window !== 'undefined' ? window.innerHeight - 200 : 500

  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 relative overflow-hidden">
      <Stage
        ref={stageRef}
        width={stageWidth}
        height={stageHeight}
        onClick={handleStageClick}
      >
        <Layer>
          {/* Background */}
          <Rect
            x={0}
            y={0}
            width={stageWidth}
            height={stageHeight}
            fill={colors.bg}
          />

          {/* Grid pattern (subtle) */}
          <Group opacity={0.05}>
            {Array.from({ length: 20 }).map((_, i) => (
              <Group key={i}>
                <Rect
                  x={i * 40}
                  y={0}
                  width={1}
                  height={stageHeight}
                  fill={colors.accent}
                />
                <Rect
                  x={0}
                  y={i * 40}
                  width={stageWidth}
                  height={1}
                  fill={colors.accent}
                />
              </Group>
            ))}
          </Group>

          {/* Furniture items */}
          {furniture.map(item => (
            <FurnitureItemComponent
              key={item.id}
              item={item}
              isSelected={selectedItemId === item.id}
              onSelect={() => selectItem(item.id)}
              onDragEnd={(pos) => handleItemDragEnd(item.id, pos)}
              onRotate={(rot) => handleItemRotate(item.id, rot)}
              onDelete={() => removeFurniture(item.id)}
            />
          ))}

          {/* Empty state */}
          {furniture.length === 0 && (
            <Text
              x={stageWidth / 2 - 150}
              y={stageHeight / 2 - 50}
              text="Tap + Add to start decorating"
              fontSize={24}
              fontFamily="Inter"
              fill={colors.accent}
              opacity={0.3}
              align="center"
              width={300}
            />
          )}
        </Layer>
      </Stage>

      {/* Keyboard controls hint */}
      <div className="absolute bottom-4 left-4 text-xs text-slate-400 pointer-events-none">
        <p>• Drag to move • Right-click to rotate • Double-click to delete</p>
      </div>
    </div>
  )
}
```

<file_path>
sandship/src/components/loft/FurnitureItem.tsx
</file_path>

<edit_description>
Create draggable furniture item component
</edit_description>

```
import React, { useRef, useState } from 'react'
import { Group, Text, Circle, Rect } from 'react-konva'
import Konva from 'konva'
import { FurnitureItem } from '../../types'

interface FurnitureItemProps {
  item: FurnitureItem
  isSelected: boolean
  onSelect: () => void
  onDragEnd: (pos: { x: number; y: number }) => void
  onRotate: (rotation: number) => void
  onDelete: () => void
}

const FURNITURE_EMOJIS: Record<string, string> = {
  'bed': '🛏️',
  'couch': '🛋️',
  'desk': '🪑',
  'plant': '🪴',
  'lamp': '💡',
  'rug': '📦',
  'speaker': '🔊',
  'tv': '📺',
  'poster': '🖼️',
  'shelf': '📚',
  'painting': '🎨',
  'guitar': '🎸',
}

export default function FurnitureItem({
  item,
  isSelected,
  onSelect,
  onDragEnd,
  onRotate,
  onDelete,
}: FurnitureItemProps) {
  const groupRef = useRef<Konva.Group>(null)
  const [isRotating, setIsRotating] = useState(false)

  const emoji = FURNITURE_EMOJIS[item.type] || '📦'
  const size = 50

  const handleDragEnd = (e: any) => {
    onDragEnd({ x: e.target.x(), y: e.target.y() })
  }

  const handleDoubleClick = () => {
    onDelete()
  }

  const handleContextMenu = (e: any) => {
    e.evt.preventDefault()
    setIsRotating(!isRotating)
    if (isRotating) {
      const rotation = (item.rotation + 45) % 360
      onRotate(rotation)
    }
  }

  return (
    <Group
      ref={groupRef}
      x={item.x}
      y={item.y}
      rotation={item.rotation}
      draggable
      onDragEnd={handleDragEnd}
      onClick={onSelect}
      onDoubleClick={handleDoubleClick}
      onContextMenu={handleContextMenu}
      zIndex={item.zIndex}
    >
      {/* Furniture background */}
      <Rect
        x={-size / 2}
        y={-size / 2}
        width={size}
        height={size}
        fill="rgba(34, 211, 238, 0.2)"
        stroke={isSelected ? '#22d3ee' : 'rgba(34, 211, 238, 0.5)'}
        strokeWidth={isSelected ? 2 : 1}
        cornerRadius={8}
      />

      {/* Emoji */}
      <Text
        x={-20}
        y={-15}
        text={emoji}
        fontSize={40}
        align="center"
      />

      {/* Selection indicator */}
      {isSelected && (
        <>
          <Circle
            x={-size / 2 - 4}
            y={-size / 2 - 4}
            radius={4}
            fill="#22d3ee"
          />
          <Text
            x={-size / 2 - 15}
            y={size / 2 + 8}
            text="Drag"
            fontSize={10}
            fill="#22d3ee"
            align="center"
          />
          <Text
            x={size / 2 - 30}
            y={size / 2 + 8}
            text="R: Rotate"
            fontSize={10}
            fill="#22d3ee"
            align="center"
          />
        </>
      )}
    </Group>
  )
}
```

<file_path>
sandship/src/components/loft/FurnitureInventory.tsx
</file_path>

<edit_description>
Create inventory sidebar with furniture items
</edit_description>

```
import React from 'react'
import { motion } from 'framer-motion'
import { useLoftStore } from '../../stores/loftStore'

const FURNITURE_ITEMS = [
  { id: 'bed', label: 'Bed', emoji: '🛏️' },
  { id: 'couch', label: 'Couch', emoji: '🛋️' },
  { id: 'desk', label: 'Desk', emoji: '🪑' },
  { id: 'plant', label: 'Plant', emoji: '🪴' },
  { id: 'lamp', label: 'Lamp', emoji: '💡' },
  { id: 'rug', label: 'Rug', emoji: '📦' },
  { id: 'speaker', label: 'Speaker', emoji: '🔊' },
  { id: 'tv', label: 'TV', emoji: '📺' },
  { id: 'poster', label: 'Poster', emoji: '🖼️' },
  { id: 'shelf', label: 'Shelf', emoji: '📚' },
  { id: 'painting', label: 'Painting', emoji: '🎨' },
  { id: 'guitar', label: 'Guitar', emoji: '🎸' },
]

export default function FurnitureInventory() {
  const { addFurniture } = useLoftStore()

  const handleAddFurniture = (type: string) => {
    const newItem = {
      id: `furniture-${Date.now()}`,
      type: type as any,
      x: Math.random() * 300 + 50,
      y: Math.random() * 300 + 50,
      rotation: 0,
      scale: 1,
      zIndex: Math.floor(Math.random() * 100),
    }
    addFurniture(newItem)
  }

  return (
    <div className="p-4 space-y-2">
      <h3 className="font-bold text-cyan-300 text-sm mb-4">Furniture</h3>
      <div className="grid grid-cols-2 gap-2">
        {FURNITURE_ITEMS.map((item, idx) => (
          <motion.button
            key={item.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            onClick={() => handleAddFurniture(item.id)}
            className="glass rounded-lg p-3 text-center hover:border-cyan-500/50 hover:bg-cyan-500/10 transition-all"
          >
            <div className="text-3xl mb-1">{item.emoji}</div>
            <div className="text-xs text-slate-300 font-medium">{item.label}</div>
          </motion.button>
        ))}
      </div>

      <div className="pt-4 text-xs text-slate-400 text-center">
        <p>Click to add • Drag to place • Right-click to rotate</p>
      </div>
    </div>
  )
}
```

<file_path>
sandship/src/components/screens/PassengersScreen.tsx
</file_path>

<edit_description>
Create flight lobby with passenger list
</edit_description>

```
import React from 'react'
import { motion } from 'framer-motion'
import { useFlightStore } from '../../stores/flightStore'
import { Users, Circle } from 'lucide-react'

export default function PassengersScreen() {
  const { passengers, setVisitingLoftId } = useFlightStore()
  const onlineCount = passengers.filter(p => p.status === 'online').length

  return (
    <div className="w-full h-full flex flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass border-b border-slate-700/50 p-4"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-cyan-400" />
            <div>
              <h2 className="font-bold text-cyan-300">Flight Passengers</h2>
              <p className="text-xs text-slate-400">{onlineCount} online</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Passenger Grid */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-2 gap-3">
          {passengers.map((passenger, idx) => (
            <motion.button
              key={passenger.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              onClick={() => setVisitingLoftId(passenger.loftId)}
              className="glass rounded-xl p-4 text-center hover:border-cyan-500/50 hover:bg-cyan-500/10 transition-all group"
            >
              {/* Avatar */}
              <div className="text-5xl mb-2 group-hover:scale-110 transition-transform">
                {passenger.avatar}
              </div>

              {/* Name */}
              <h3 className="font-bold text-slate-100 mb-1">{passenger.name}</h3>

              {/* Status */}
              <div className="flex items-center justify-center gap-1 text-xs mb-3">
                <Circle
                  className={`w-2 h-2 ${passenger.status === 'online' ? 'fill-green-400 text-green-400' : 'fill-slate-500 text-slate-500'}`}
                />
                <span className={passenger.status === 'online' ? 'text-green-400' : 'text-slate-400'}>
                  {passenger.status === 'online' ? 'Online' : 'Offline'}
                </span>
              </div>

              {/* Visit button */}
              <div className="text-xs font-medium text-cyan-300 opacity-0 group-hover:opacity-100 transition-opacity">
                Visit Loft →
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  )
}
```

<file_path>
sandship/src/components/screens/ChatScreen.tsx
</file_path>

<edit_description>
Create global flight chat screen
</edit_description>

```
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useFlightStore } from '../../stores/flightStore'
import { useUserStore } from '../../stores/userStore'
import { MessageCircle, Send } from 'lucide-react'
import toast from 'react-hot-toast'

export default function ChatScreen() {
  const { messages, addMessage } = useFlightStore()
  const { userName, userAvatar } = useUserStore()
  const [inputText, setInputText] = useState('')

  const handleSendMessage = () => {
    if (!inputText.trim()) return

    const newMessage = {
      id: `msg-${Date.now()}`,
      senderId: 'user',
      senderName: userName || 'You',
      senderAvatar: userAvatar || '👤',
      text: inputText,
      timestamp: Date.now(),
      isSystemMessage: false,
    }

    addMessage(newMessage)
    setInputText('')
    toast.success('Message sent!', { icon: '💬' })
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="w-full h-full flex flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass border-b border-slate-700/50 p-4 flex items-center gap-2"
      >
        <MessageCircle className="w-5 h-5 text-cyan-400" />
        <div>
          <h2 className="font-bold text-cyan-300">Flight Chat</h2>
          <p className="text-xs text-slate-400">Everyone on your flight</p>
        </div>
      </motion.div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-center h-full text-center"
          >
            <div>
              <MessageCircle className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400">No messages yet</p>
              <p className="text-xs text-slate-500 mt-1">Say hello to other passengers!</p>
            </div>
          </motion.div>
        ) : (
          messages.map((msg, idx) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="flex gap-2"
            >
              {/* Avatar */}
              <div className="text-2xl flex-shrink-0">{msg.senderAvatar}</div>

              {/* Message */}
              <div className="flex-1">
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="font-bold text-sm text-cyan-300">{msg.senderName}</span>
                  <span className="text-xs text-slate-500">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <div className="glass rounded-lg p-3 text-sm text-slate-100">
                  {msg.text}
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Input */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass border-t border-slate-700/50 p-4 space-y-3"
      >
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Say hello..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            className="input-base flex-1"
          />
          <button
            onClick={handleSendMessage}
            className="btn-primary flex items-center justify-center w-10 h-10 p-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </div>
  )
}
```

<file_path>
sandship/src/components/screens/VisitLoftScreen.tsx
</file_path>

<edit_description>
Create visitor mode screen for viewing other lofts
</edit_description>

```
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useFlightStore } from '../../stores/flightStore'
import { useUserStore } from '../../stores/userStore'
import { ArrowLeft, Volume2, MessageCircle } from 'lucide-react'

export default function VisitLoftScreen() {
  const { visitingLoftId, lofts, setVisitingLoftId } = useFlightStore()
  const { setCurrentPage } = useUserStore()
  const [showChat, setShowChat] = useState(false)
  const [chatText, setChatText] = useState('')

  if (!visitingLoftId || !lofts[visitingLoftId]) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <p className="text-slate-400">Loft not found</p>
      </div>
    )
  }

  const loft = lofts[visitingLoftId]

  const handleExit = () => {
    setVisitingLoftId(null)
    setCurrentPage('passengers')
  }

  return (
    <div className="w-full h-full flex flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass border-b border-slate-700/50 p-4 flex items-center justify-between"
      >
        <div className="flex items-center gap-2">
          <button
            onClick={handleExit}
            className="btn-ghost flex items-center gap-1"
          >
            <ArrowLeft className="w-4 h-4" />
            Exit
          </button>
        </div>

        <div className="text-center">
          <p className="text-lg font-bold text-cyan-300">{loft.ownerName}'s Loft</p>
          <p className="text-xs text-slate-400">Visitor Mode</p>
        </div>

        <button
          onClick={() => setShowChat(!showChat)}
          className="btn-secondary flex items-center gap-1"
        >
          <MessageCircle className="w-4 h-4" />
          Chat
        </button>
      </motion.div>

      {/* Room view */}
      <div className="flex-1 relative overflow-hidden">
        <div className="w-full h-full flex items-center justify-center">
          {/* Background matching the loft's wallpaper */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/40 to-slate-900/40" />

          {/* Furniture preview */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-4"
          >
            <h3 className="text-2xl font-bold text-cyan-300 mb-4">
              {loft.ownerName}'s Room
            </h3>

            {/* Furniture items display */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              {loft.furniture.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1 }}
                  className="glass rounded-lg p-4 text-4xl hover:scale-105 transition-transform"
                >
                  {item.type === 'bed' && '🛏️'}
                  {item.type === 'couch' && '🛋️'}
                  {item.type === 'desk' && '🪑'}
                  {item.type === 'plant' && '🪴'}
                  {item.type === 'lamp' && '💡'}
                  {item.type === 'rug' && '📦'}
                  {item.type === 'speaker' && '🔊'}
                  {item.type === 'tv' && '📺'}
                  {item.type === 'poster' && '🖼️'}
                  {item.type === 'shelf' && '📚'}
                  {item.type === 'painting' && '🎨'}
                  {item.type === 'guitar' && '🎸'}
                </motion.div>
              ))}
            </div>

            {/* Now Playing */}
            {loft.currentlyPlaying && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="glass rounded-lg p-4 max-w-xs mx-auto"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Volume2 className="w-4 h-4 text-cyan-400 animate-pulse" />
                  <span className="text-sm text-slate-400">Now Playing</span>
                </div>
                <p className="font-bold text-cyan-300">{loft.currentlyPlaying.title}</p>
                <p className="text-sm text-slate-400">{loft.currentlyPlaying.artist}</p>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Chat panel */}
      {showChat && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="glass border-t border-slate-700/50 p-4 space-y-3"
        >
          <div className="flex gap-2">
            <input
              type="text"
              placeholder={`Chat with ${loft.ownerName}...`}
              value={chatText}
              onChange={(e) => setChatText(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  setChatText('')
                }
              }}
              className="input-base flex-1"
            />
            <button className="btn-primary">Send</button>
          </div>
        </motion.div>
      )}
    </div>
  )
}
```

<file_path>
sandship/src/components/common/Confetti.tsx
</file_path>

<edit_description>
Create confetti celebration component
</edit_description>

```
import React, { useEffect } from 'react'
import confetti from 'canvas-confetti'

export default function Confetti() {
  useEffect(() => {
    // Trigger confetti on first render (boarding)
    const timer = setTimeout(() => {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.3 },
        colors: ['#22d3ee', '#06b6d4', '#0891b2', '#0e7490'],
      })
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  return null
}
```

<file_path>
sandship/index.html
</file_path>

<edit_description>
Create HTML entry point with PWA meta tags
</edit_description>

```
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
    <meta name="theme-color" content="#0f172a" />
    <meta name="description" content="Build your dream loft, blast your music, and visit other passengers' rooms while flying." />

    <!-- PWA -->
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
    <meta name="apple-mobile-web-app-title" content="SkyLoft" />
    <link rel="apple-touch-icon" href="/pwa-192x192.png" />

    <!-- Manifest -->
    <link rel="manifest" href="/manifest.json" />

    <!-- Title -->
    <title>SkyLoft - Build your dream loft in the sky</title>

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
  </head>
  <body class="bg-slate-900 text-slate-100 overflow-hidden">
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

<file_path>
sandship/vite.config.ts
</file_path>

<edit_description>
Create Vite config with PWA plugin and GitHub Pages support
</edit_description>

```
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png'],
      manifest: {
        name: 'SkyLoft',
        short_name: 'SkyLoft',
        description: 'Build your dream loft, blast your music, and visit other passengers\' rooms while flying.',
        theme_color: '#0f172a',
        background_color: '#0f172a',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: '/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webp,mp3}'],
        cleanupOutdatedCaches: true
      }
    })
  ],
  base: '/',
  server: {
    port: 5173,
    strictPort: false
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          'firebase': ['firebase/app', 'firebase/firestore', 'firebase/auth'],
          'konva': ['konva', 'react-konva']
        }
      }
    }
  }
})
```

<file_path>
sandship/tsconfig.json
</file_path>

<edit_description>
Create TypeScript configuration
</edit_description>

```
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "noEmit": true,
    "jsx": "react-jsx"
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

<file_path>
sandship/tsconfig.node.json
</file_path>

<edit_description>
Create TypeScript Node configuration
</edit_description>

```
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}
```

<file_path>
sandship/tailwind.config.ts
</file_path>

<edit_description>
Create Tailwind CSS configuration with dark theme
</edit_description>

```
import type { Config } from 'tailwindcss'
import defaultTheme from 'tailwindcss/defaultTheme'

const config: Config = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        slate: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          850: '#172033',
          900: '#0f172a',
          950: '#020617',
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      animation: {
        float: 'float 3s ease-in-out infinite',
        glow: 'glow 2s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 5px rgba(34, 211, 238, 0.5)' },
          '50%': { boxShadow: '0 0 20px rgba(34, 211, 238, 0.8)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
      },
    },
  },
  plugins: [],
}

export default config
```

<file_path>
sandship/postcss.config.js
</file_path>

<edit_description>
Create PostCSS configuration
</edit_description>

```
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

<file_path>
sandship/.gitignore
</file_path>

<edit_description>
Create Git ignore file
</edit_description>

```
# Dependencies
node_modules/
/.pnp
.pnp.js

# Testing
/coverage

# Production
/dist
/build

# Misc
.DS_Store
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Editor
.vscode/
.idea/
*.swp
*.swo

# OS
Thumbs.db

# PWA
.next
```

<file_path>
sandship/.env.example
</file_path>

<edit_description>
Create example environment file
</edit_description>

```
# Firebase Configuration
# Get these from Firebase Console > Project Settings > Web app

VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

<file_path>
sandship/public/manifest.json
</file_path>

<edit_description>
Create PWA manifest file
</edit_description>

```
{
  "name": "SkyLoft",
  "short_name": "SkyLoft",
  "description": "Build your dream loft, blast your music, and visit other passengers' rooms while flying.",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#0f172a",
  "theme_color": "#0f172a",
  "orientation": "portrait-primary",
  "scope": "/",
  "icons": [
    {
      "src": "/pwa-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/pwa-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/pwa-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "maskable"
    }
  ]
}
