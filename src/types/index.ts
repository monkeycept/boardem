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
