import { ChatMessage, FurnitureItem, FurnitureType, Loft, Passenger } from '../types'
import { getPresetTrack } from './tracks'
import { wada } from '../theme/wada'

type Spec = { type: FurnitureType; x: number; y: number; rotation?: number; scale?: number; color?: string; trackId?: string }

const build = (owner: string, items: Spec[]): FurnitureItem[] =>
  items.map((item, idx) => ({
    id: `${owner}-item-${idx}`,
    type: item.type,
    x: item.x,
    y: item.y,
    rotation: item.rotation ?? 0,
    scale: item.scale ?? 1,
    zIndex: idx,
    color: item.color,
    trackId: item.trackId,
  }))

interface DemoProfile {
  id: string
  name: string
  avatar: string
  seat: string
  vibe: string
  status: 'online' | 'offline'
  wallpaper: string
  flooring: string
  trackId: string
  furniture: Spec[]
  greeting: string
  replies: string[]
}

export const DEMO_PROFILES: DemoProfile[] = [
  {
    id: 'demo-amara',
    name: 'Amara',
    avatar: '👩‍💻',
    seat: '14C',
    vibe: 'Cyberpunk hacker den',
    status: 'online',
    wallpaper: 'dark-neon',
    flooring: 'neon-grid',
    trackId: 'midnight-code',
    furniture: [
      { type: 'album', x: 90, y: 70, trackId: 'midnight-code' },
      { type: 'poster', x: 380, y: 72, color: wada.benzolGreen },
      { type: 'rug', x: 230, y: 300, scale: 1.3, color: wada.jasperRed },
      { type: 'desk', x: 120, y: 220, scale: 1.2 },
      { type: 'tv', x: 200, y: 205 },
      { type: 'lamp', x: 60, y: 200 },
      { type: 'bed', x: 360, y: 300, scale: 1.1 },
      { type: 'speaker', x: 270, y: 210 },
      { type: 'plant', x: 420, y: 205 },
    ],
    greeting: "oh hey, welcome to the den 👾 mind the cables",
    replies: ['lol same', 'this track slaps at 30,000 ft', "i'm debugging the wifi rn, don't tell anyone", 'drop by the chat later!', '👀 nice'],
  },
  {
    id: 'demo-marcus',
    name: 'Marcus',
    avatar: '👨‍🎓',
    seat: '9B',
    vibe: 'Cozy bookworm nook',
    status: 'online',
    wallpaper: 'warm-brown',
    flooring: 'wood',
    trackId: 'autumn-breeze',
    furniture: [
      { type: 'painting', x: 110, y: 72 },
      { type: 'album', x: 230, y: 70, trackId: 'autumn-breeze' },
      { type: 'shelf', x: 60, y: 210, scale: 1.2 },
      { type: 'shelf', x: 400, y: 210, scale: 1.2 },
      { type: 'rug', x: 230, y: 300, scale: 1.4, color: wada.rawSienna },
      { type: 'couch', x: 230, y: 300, scale: 1.1 },
      { type: 'lamp', x: 140, y: 230 },
      { type: 'plant', x: 330, y: 230 },
      { type: 'plant', x: 60, y: 330 },
    ],
    greeting: "welcome in! grab a book, any book 📚",
    replies: ["have you read anything good lately?", 'that reminds me of a novel I just finished', 'tea? ☕', 'the window seat is the best seat', 'haha fair'],
  },
  {
    id: 'demo-zara',
    name: 'Zara',
    avatar: '👩‍🎨',
    seat: '21F',
    vibe: 'Minimalist art studio',
    status: 'online',
    wallpaper: 'light-gray',
    flooring: 'marble',
    trackId: 'ambient-spaces',
    furniture: [
      { type: 'painting', x: 150, y: 75, scale: 1.3 },
      { type: 'poster', x: 320, y: 75, color: wada.hermosaPink },
      { type: 'album', x: 410, y: 70, trackId: 'ambient-spaces' },
      { type: 'bed', x: 340, y: 300 },
      { type: 'lamp', x: 100, y: 240 },
    ],
    greeting: 'hi ✨ less is more, right?',
    replies: ['mm, I like that', 'negative space is underrated', "I'm sketching the clouds outside", '🎨', 'come back later, the light changes'],
  },
  {
    id: 'demo-kai',
    name: 'Kai',
    avatar: '🧑‍🚀',
    seat: '3A',
    vibe: 'RGB gamer battlestation',
    status: 'online',
    wallpaper: 'dark-purple',
    flooring: 'neon-grid',
    trackId: 'digital-dreams',
    furniture: [
      { type: 'poster', x: 70, y: 72, color: wada.rosolancPurple },
      { type: 'poster', x: 140, y: 72, color: wada.cerulianBlue },
      { type: 'album', x: 380, y: 70, trackId: 'digital-dreams' },
      { type: 'desk', x: 230, y: 210, scale: 1.4 },
      { type: 'tv', x: 230, y: 185, scale: 0.9 },
      { type: 'speaker', x: 150, y: 215 },
      { type: 'speaker', x: 310, y: 215 },
      { type: 'rug', x: 230, y: 310, scale: 1.2, color: wada.benzolGreen },
      { type: 'couch', x: 230, y: 320 },
    ],
    greeting: 'yo! gg for stopping by 🎮',
    replies: ['one more game then sleep', 'the lag up here is brutal lol', 'you play anything?', 'RGB = +10 fps, everyone knows that', 'gg'],
  },
  {
    id: 'demo-nova',
    name: 'Nova',
    avatar: '👩‍🎤',
    seat: '17D',
    vibe: 'Vinyl producer loft',
    status: 'online',
    wallpaper: 'twilight',
    flooring: 'carpet',
    trackId: 'vinyl-groove',
    furniture: [
      { type: 'album', x: 80, y: 70, trackId: 'vinyl-groove' },
      { type: 'album', x: 160, y: 70, trackId: 'retro-vibes' },
      { type: 'album', x: 240, y: 70, trackId: 'midnight-code' },
      { type: 'album', x: 320, y: 70, trackId: 'world-mix' },
      { type: 'desk', x: 200, y: 220, scale: 1.2 },
      { type: 'speaker', x: 110, y: 225, scale: 1.2 },
      { type: 'speaker', x: 290, y: 225, scale: 1.2 },
      { type: 'guitar', x: 400, y: 230 },
      { type: 'rug', x: 200, y: 310, scale: 1.3, color: wada.orangeYellow },
      { type: 'plant', x: 420, y: 330 },
    ],
    greeting: 'welcome to the studio 🎧 tap any record on the wall',
    replies: ['this one was sampled from the engine hum btw', 'what are you listening to?', 'tap a record, trust me', 'beats per mile 🎶', 'yesss'],
  },
  {
    id: 'demo-river',
    name: 'River',
    avatar: '🧑‍🌾',
    seat: '25A',
    vibe: 'Indoor forest',
    status: 'online',
    wallpaper: 'forest-green',
    flooring: 'moss',
    trackId: 'nature-sounds',
    furniture: [
      { type: 'painting', x: 230, y: 72 },
      { type: 'album', x: 380, y: 70, trackId: 'nature-sounds' },
      { type: 'plant', x: 50, y: 190, scale: 1.3 },
      { type: 'plant', x: 120, y: 330 },
      { type: 'plant', x: 410, y: 200, scale: 1.2 },
      { type: 'plant', x: 300, y: 340 },
      { type: 'bed', x: 230, y: 260 },
      { type: 'lamp', x: 350, y: 250 },
    ],
    greeting: 'shh, listen... birds 🐦 (well, sort of)',
    replies: ['breathe in, breathe out', "I brought 4 plants through security, don't ask", '🌿', 'nature finds a way, even at altitude', 'so peaceful'],
  },
  {
    id: 'demo-sienna',
    name: 'Sienna',
    avatar: '💃',
    seat: '6E',
    vibe: '80s retro lounge',
    status: 'online',
    wallpaper: 'pastel-pink',
    flooring: 'retro-tile',
    trackId: 'retro-vibes',
    furniture: [
      { type: 'poster', x: 90, y: 72, color: wada.orangeYellow },
      { type: 'poster', x: 160, y: 72, color: wada.hermosaPink },
      { type: 'album', x: 360, y: 70, trackId: 'retro-vibes' },
      { type: 'couch', x: 150, y: 270, scale: 1.1 },
      { type: 'tv', x: 330, y: 215 },
      { type: 'lamp', x: 60, y: 230 },
      { type: 'speaker', x: 410, y: 300 },
      { type: 'plant', x: 270, y: 330 },
    ],
    greeting: 'totally radical, come in! 🕺',
    replies: ['like, totally', 'cassettes > streaming, fight me', '💖', 'dance break?', 'tubular!'],
  },
  {
    id: 'demo-atlas',
    name: 'Atlas',
    avatar: '👨‍✈️',
    seat: '2A',
    vibe: "Traveller's map room",
    status: 'offline',
    wallpaper: 'harbor-dusk',
    flooring: 'tatami',
    trackId: 'world-mix',
    furniture: [
      { type: 'painting', x: 100, y: 72 },
      { type: 'poster', x: 190, y: 72, color: wada.cossackGreen },
      { type: 'album', x: 280, y: 70, trackId: 'world-mix' },
      { type: 'desk', x: 130, y: 220 },
      { type: 'shelf', x: 380, y: 210 },
      { type: 'guitar', x: 300, y: 230 },
      { type: 'rug', x: 230, y: 310, scale: 1.3, color: wada.cerulianBlue },
    ],
    greeting: '(Atlas is napping — but his door is open)',
    replies: ['zzz', '...', '😴'],
  },
]

export const demoPassengers = (): Passenger[] =>
  DEMO_PROFILES.map((p, i) => ({
    id: p.id,
    name: p.name,
    avatar: p.avatar,
    seat: p.seat,
    status: p.status,
    loftId: p.id,
    vibe: p.vibe,
    joinedAt: Date.now() - (i + 1) * 300000,
  }))

export const demoLofts = (flightCode: string): Record<string, Loft> =>
  Object.fromEntries(
    DEMO_PROFILES.map(p => {
      const track = getPresetTrack(p.trackId)
      return [
        p.id,
        {
          id: p.id,
          ownerId: p.id,
          ownerName: p.name,
          flightCode,
          wallpaper: p.wallpaper,
          flooring: p.flooring,
          furniture: build(p.id, p.furniture),
          currentlyPlaying: track ? { trackId: track.id, title: track.title, artist: track.artist } : null,
          updatedAt: Date.now(),
        } satisfies Loft,
      ]
    }),
  )

export const demoSeedMessages = (): ChatMessage[] => {
  const now = Date.now()
  const lines: [string, string, number][] = [
    ['demo-kai', 'anyone else on the bad wifi seat 😂', 14],
    ['demo-nova', 'my loft has new records up, come by 🎧', 11],
    ['demo-marcus', "first time using this — it's like a tiny neighbourhood", 7],
    ['demo-amara', 'pro tip: tap an album on someone’s wall to hear it', 4],
  ]
  return lines.map(([id, text, minsAgo], i) => {
    const p = DEMO_PROFILES.find(d => d.id === id)!
    return {
      id: `seed-${i}`,
      senderId: p.id,
      senderName: p.name,
      senderAvatar: p.avatar,
      text,
      timestamp: now - minsAgo * 60000,
    }
  })
}

export const getDemoProfile = (id: string) => DEMO_PROFILES.find(p => p.id === id)

export const GLOBAL_CHAT_REPLIES = [
  'welcome aboard! 👋',
  'hiii',
  'come visit my loft!',
  'what are you listening to?',
  'haha love that',
  'same 😂',
  'anyone know when the snacks come round?',
]
