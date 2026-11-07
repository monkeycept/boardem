import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import toast from 'react-hot-toast'
import { ChatMessage, Flight, Loft, Passenger, SyncMode } from '../types'
import { persistStorage } from '../lib/storage'
import { connectLive, isFirebaseConfigured, LiveSession } from '../lib/firebase'
import { demoLofts, demoPassengers, demoSeedMessages, getDemoProfile, GLOBAL_CHAT_REPLIES } from '../lib/demo-data'
import { ROOM_H, ROOM_W, WALL_H } from '../lib/room'
import { uid } from '../lib/ids'
import { useLoftStore } from './loftStore'
import { useUserStore } from './userStore'

export const DEMO_ME = 'me'

interface FlightState {
  flight: Flight | null
  mode: SyncMode
  myId: string
  connecting: boolean
  passengers: Passenger[]
  lofts: Record<string, Loft>
  messages: ChatMessage[]
  visitingLoftId: string | null
  myPos: { x: number; y: number }

  board: (flight: Flight) => Promise<void>
  resume: () => Promise<void>
  leave: () => void
  sendMessage: (text: string, loftId?: string) => void
  visit: (loftId: string) => void
  exitVisit: () => void
  walkTo: (x: number, y: number) => void
  demoDropBy: () => void
}

const DROP_BY_LINES = [
  'ooh, love what you did with the place ✨',
  'okay this loft is a vibe',
  'can I steal this layout? 😄',
  'cozy!! 10/10 would visit again',
  'nice taste in music 🎶',
]

let live: LiveSession | null = null
let loftUnsub: (() => void) | null = null
let loftTimer: number | undefined
const botTimers = new Set<number>()

const later = (fn: () => void, ms: number) => {
  const t = window.setTimeout(() => {
    botTimers.delete(t)
    fn()
  }, ms)
  botTimers.add(t)
}

const pick = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)]

const DOOR = { x: ROOM_W / 2, y: ROOM_H - 40 }

/** My loft as other passengers see it. */
export function buildMyLoft(myId: string, flightCode: string): Loft {
  const l = useLoftStore.getState()
  return {
    id: myId,
    ownerId: myId,
    ownerName: useUserStore.getState().name || 'You',
    flightCode,
    furniture: l.furniture,
    wallpaper: l.wallpaper,
    flooring: l.flooring,
    currentlyPlaying: l.nowPlaying,
    updatedAt: Date.now(),
  }
}

export const useFlightStore = create<FlightState>()(
  persist(
    (set, get) => {
      const botSay = (senderId: string, text: string, loftId?: string, delay = 1500) => {
        later(() => {
          const p = getDemoProfile(senderId)
          if (!p || get().mode !== 'demo' || !get().flight) return
          const msg: ChatMessage = { id: uid('msg'), senderId: p.id, senderName: p.name, senderAvatar: p.avatar, text, timestamp: Date.now(), loftId }
          set({ messages: [...get().messages, msg] })
        }, delay)
      }

      const startDemo = (flight: Flight, keepMessages: boolean) => {
        set({
          mode: 'demo',
          myId: DEMO_ME,
          passengers: demoPassengers(),
          lofts: demoLofts(flight.flightNumber),
          messages: keepMessages && get().messages.length ? get().messages : demoSeedMessages(),
        })
      }

      const startLive = async (flight: Flight) => {
        const user = useUserStore.getState()
        set({ connecting: true })
        try {
          live = await connectLive(flight.flightNumber, { name: user.name, avatar: user.avatar, seat: flight.seatNumber }, {
            onPassengers: passengers => set({ passengers }),
            onLofts: lofts => set({ lofts }),
            onMessages: messages => set({ messages }),
          })
          set({ mode: 'live', myId: live.uid, connecting: false })
          const push = () => {
            window.clearTimeout(loftTimer)
            loftTimer = window.setTimeout(() => {
              const f = get().flight
              if (live && f) void live.saveLoft(buildMyLoft(live.uid, f.flightNumber)).catch(() => undefined)
            }, 800)
          }
          push()
          loftUnsub = useLoftStore.subscribe(push)
        } catch (err) {
          console.warn('Live sync unavailable, falling back to demo neighbours', err)
          set({ connecting: false })
          toast('Live sync is unavailable — showing demo neighbours instead', { icon: '📡' })
          startDemo(flight, false)
        }
      }

      const teardown = () => {
        botTimers.forEach(t => window.clearTimeout(t))
        botTimers.clear()
        loftUnsub?.()
        loftUnsub = null
        live?.stop()
        live = null
      }

      return {
        flight: null,
        mode: 'demo',
        myId: DEMO_ME,
        connecting: false,
        passengers: [],
        lofts: {},
        messages: [],
        visitingLoftId: null,
        myPos: DOOR,

        board: async flight => {
          teardown()
          set({ flight, visitingLoftId: null, messages: [] })
          if (isFirebaseConfigured) await startLive(flight)
          else startDemo(flight, false)
        },

        resume: async () => {
          const { flight, mode } = get()
          if (!flight) return
          set({ visitingLoftId: null })
          if (isFirebaseConfigured && mode === 'live') await startLive(flight)
          else startDemo(flight, true)
        },

        leave: () => {
          teardown()
          set({ flight: null, passengers: [], lofts: {}, messages: [], visitingLoftId: null, mode: 'demo', myId: DEMO_ME })
        },

        sendMessage: (text, loftId) => {
          const clean = text.trim().slice(0, 280)
          if (!clean) return
          const user = useUserStore.getState()
          const msg: ChatMessage = {
            id: uid('msg'),
            senderId: get().myId,
            senderName: user.name || 'You',
            senderAvatar: user.avatar,
            text: clean,
            timestamp: Date.now(),
            loftId,
          }
          if (get().mode === 'live' && live) {
            void live.sendMessage(msg).catch(() => toast.error("Message didn't send — check your connection"))
            return
          }
          set({ messages: [...get().messages, msg] })

          // Demo neighbours chat back.
          const asked = clean.includes('?')
          if (loftId) {
            const owner = getDemoProfile(loftId)
            if (owner && owner.status === 'online') botSay(owner.id, pick(owner.replies), loftId, 1400 + Math.random() * 1600)
            const other = get().passengers.find(p => p.visiting === loftId && p.id !== loftId)
            const otherProfile = other && getDemoProfile(other.id)
            if (otherProfile && (loftId === DEMO_ME || Math.random() < 0.35))
              botSay(otherProfile.id, pick(otherProfile.replies), loftId, (owner ? 3500 : 1500) + Math.random() * 2000)
          } else if (asked || Math.random() < 0.6) {
            const online = get().passengers.filter(p => p.status === 'online')
            const responder = online.length ? pick(online) : null
            const profile = responder && getDemoProfile(responder.id)
            if (profile) botSay(profile.id, pick([...GLOBAL_CHAT_REPLIES, ...profile.replies]), undefined, 1800 + Math.random() * 2500)
          }
        },

        visit: loftId => {
          set({ visitingLoftId: loftId, myPos: DOOR })
          if (get().mode === 'live' && live) {
            void live.updateMe({ visiting: loftId, x: DOOR.x, y: DOOR.y }).catch(() => undefined)
            return
          }
          // Demo: the owner says hi, and sometimes another neighbour is hanging out too.
          const owner = getDemoProfile(loftId)
          const recentlyGreeted = get().messages.some(
            m => m.loftId === loftId && m.senderId === loftId && Date.now() - m.timestamp < 5 * 60000,
          )
          if (owner && !recentlyGreeted) botSay(owner.id, owner.greeting, loftId, owner.status === 'online' ? 900 : 300)
          const candidates = get().passengers.filter(p => p.status === 'online' && p.id !== loftId && p.id !== DEMO_ME)
          const guest = candidates.length && Math.random() < 0.6 ? pick(candidates) : null
          set({
            passengers: get().passengers.map(p =>
              p.id === guest?.id
                ? { ...p, visiting: loftId, x: 60 + Math.random() * (ROOM_W - 120), y: WALL_H + 60 + Math.random() * 120 }
                : { ...p, visiting: null },
            ),
          })
        },

        exitVisit: () => {
          set({ visitingLoftId: null })
          if (get().mode === 'live' && live) {
            void live.updateMe({ visiting: null }).catch(() => undefined)
            return
          }
          set({ passengers: get().passengers.map(p => ({ ...p, visiting: null })) })
        },

        walkTo: (x, y) => {
          const pos = { x: Math.min(ROOM_W - 20, Math.max(20, x)), y: Math.min(ROOM_H - 20, Math.max(WALL_H + 10, y)) }
          set({ myPos: pos })
          if (get().mode === 'live' && live) void live.updateMe(pos).catch(() => undefined)
        },

        /** Demo only: a neighbour pops into your loft for a bit after you save it. */
        demoDropBy: () => {
          if (get().mode !== 'demo') return
          if (get().passengers.some(p => p.visiting === DEMO_ME)) return
          const online = get().passengers.filter(p => p.status === 'online')
          const guest = online.length ? pick(online) : null
          if (!guest) return
          later(() => {
            set({
              passengers: get().passengers.map(p =>
                p.id === guest.id ? { ...p, visiting: DEMO_ME, x: 80 + Math.random() * (ROOM_W - 160), y: WALL_H + 70 + Math.random() * 100 } : p,
              ),
            })
            botSay(guest.id, pick(DROP_BY_LINES), DEMO_ME, 1200)
            later(() => {
              set({ passengers: get().passengers.map(p => (p.id === guest.id && p.visiting === DEMO_ME ? { ...p, visiting: null } : p)) })
            }, 25000)
          }, 1500)
        },
      }
    },
    {
      name: 'skyloft-flight',
      storage: persistStorage,
      version: 2,
      partialize: s => ({ flight: s.flight, mode: s.mode, messages: s.mode === 'demo' ? s.messages.slice(-100) : [] }),
    },
  ),
)
