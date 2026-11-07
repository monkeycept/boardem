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
