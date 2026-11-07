export type FurnitureType =
  | 'bed'
  | 'couch'
  | 'desk'
  | 'plant'
  | 'lamp'
  | 'rug'
  | 'speaker'
  | 'tv'
  | 'poster'
  | 'shelf'
  | 'painting'
  | 'guitar'
  | 'album'

export interface Flight {
  flightNumber: string
  airline: string
  departureAirport: string
  arrivalAirport: string
  date: string
  seatNumber: string
  passengerName: string
}

export interface FurnitureItem {
  id: string
  type: FurnitureType
  /** Centre of the item in room coordinates (see ROOM_W / ROOM_H). */
  x: number
  y: number
  rotation: number
  scale: number
  zIndex: number
  color?: string
  /** For album posters: which track the poster plays. */
  trackId?: string
}

export interface NowPlaying {
  trackId: string
  title: string
  artist: string
}

export interface Loft {
  id: string
  ownerId: string
  ownerName: string
  flightCode: string
  furniture: FurnitureItem[]
  wallpaper: string
  flooring: string
  currentlyPlaying?: NowPlaying | null
  updatedAt: number
}

export interface ChatMessage {
  id: string
  senderId: string
  senderName: string
  senderAvatar: string
  text: string
  timestamp: number
  /** Set when the message was said inside someone's loft (shown as a speech bubble there). */
  loftId?: string
  isSystemMessage?: boolean
}

export interface Passenger {
  id: string
  name: string
  avatar: string
  seat?: string
  status: 'online' | 'offline'
  loftId: string
  /** Loft id this passenger is currently visiting, if any. */
  visiting?: string | null
  /** Avatar position inside the loft being visited (room coordinates). */
  x?: number
  y?: number
  vibe?: string
  joinedAt: number
}

export interface Track {
  id: string
  title: string
  artist: string
  vibe: string
  /** Two colours used for the generated album art. */
  colors: [string, string]
  /** 'preset' tracks are generated in the browser; 'upload' tracks are the user's own files. */
  source: 'preset' | 'upload'
  url?: string
}

export type Page = 'home' | 'loft' | 'passengers' | 'chat'
export type SyncMode = 'demo' | 'live'
