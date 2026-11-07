import type { ChatMessage, Loft, Passenger } from '../types'

/**
 * Firebase is optional. When the VITE_FIREBASE_* variables are set at build time
 * the app syncs passengers, lofts and chat through Firestore ("live" mode).
 * Without them it runs entirely in the browser with demo neighbours.
 * The Firebase SDK is loaded lazily so demo builds never download it.
 */
const env = import.meta.env

const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.VITE_FIREBASE_APP_ID,
}

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.appId && !String(firebaseConfig.apiKey).startsWith('your_'),
)

/** A passenger counts as online if they've sent a heartbeat in the last 90 seconds. */
const ONLINE_WINDOW = 90_000
const HEARTBEAT = 30_000

export interface LiveHandlers {
  onPassengers: (passengers: Passenger[]) => void
  onLofts: (lofts: Record<string, Loft>) => void
  onMessages: (messages: ChatMessage[]) => void
}

export interface LiveSession {
  uid: string
  updateMe: (data: Partial<Passenger>) => Promise<void>
  saveLoft: (loft: Loft) => Promise<void>
  sendMessage: (message: ChatMessage) => Promise<void>
  stop: () => void
}

/** Firestore rejects `undefined`, so strip it out. */
const clean = <T,>(value: T): T => JSON.parse(JSON.stringify(value)) as T

export async function connectLive(
  flightCode: string,
  me: { name: string; avatar: string; seat: string },
  handlers: LiveHandlers,
): Promise<LiveSession> {
  const [{ initializeApp, getApps }, fs, { getAuth, signInAnonymously }] = await Promise.all([
    import('firebase/app'),
    import('firebase/firestore'),
    import('firebase/auth'),
  ])
  const app = getApps()[0] ?? initializeApp(firebaseConfig)
  const db = fs.getFirestore(app)
  const auth = getAuth(app)
  const { user } = await signInAnonymously(auth)
  const uid = user.uid

  const flightRef = fs.doc(db, 'flights', flightCode)
  const passengersCol = fs.collection(flightRef, 'passengers')
  const loftsCol = fs.collection(flightRef, 'lofts')
  const messagesCol = fs.collection(flightRef, 'messages')
  const meRef = fs.doc(passengersCol, uid)

  await fs.setDoc(
    meRef,
    clean({ id: uid, name: me.name, avatar: me.avatar, seat: me.seat, loftId: uid, joinedAt: Date.now(), lastSeen: Date.now(), visiting: null }),
    { merge: true },
  )

  let rawPassengers: (Passenger & { lastSeen?: number })[] = []
  const emitPassengers = () => {
    const now = Date.now()
    handlers.onPassengers(
      rawPassengers.map(p => ({ ...p, status: p.lastSeen && now - p.lastSeen < ONLINE_WINDOW ? 'online' : 'offline' })),
    )
  }

  const unsubs = [
    fs.onSnapshot(passengersCol, snap => {
      rawPassengers = snap.docs.map(d => d.data() as Passenger & { lastSeen?: number })
      emitPassengers()
    }),
    fs.onSnapshot(loftsCol, snap => {
      handlers.onLofts(Object.fromEntries(snap.docs.map(d => [d.id, d.data() as Loft])))
    }),
    fs.onSnapshot(fs.query(messagesCol, fs.orderBy('timestamp'), fs.limitToLast(200)), snap => {
      handlers.onMessages(snap.docs.map(d => ({ ...(d.data() as ChatMessage), id: d.id })))
    }),
  ]

  const beat = () => void fs.updateDoc(meRef, { lastSeen: Date.now() }).catch(() => undefined)
  const heartbeat = window.setInterval(() => {
    beat()
    emitPassengers()
  }, HEARTBEAT)
  const onVisible = () => document.visibilityState === 'visible' && beat()
  const onLeave = () => void fs.updateDoc(meRef, { lastSeen: 0, visiting: null }).catch(() => undefined)
  document.addEventListener('visibilitychange', onVisible)
  window.addEventListener('pagehide', onLeave)

  return {
    uid,
    updateMe: data => fs.setDoc(meRef, clean({ ...data, lastSeen: Date.now() }), { merge: true }),
    saveLoft: loft => fs.setDoc(fs.doc(loftsCol, uid), clean({ ...loft, id: uid, ownerId: uid })),
    sendMessage: async message => {
      const { id: _id, ...rest } = message
      void _id
      await fs.addDoc(messagesCol, clean({ ...rest, senderId: uid }))
    },
    stop: () => {
      unsubs.forEach(u => u())
      window.clearInterval(heartbeat)
      document.removeEventListener('visibilitychange', onVisible)
      window.removeEventListener('pagehide', onLeave)
      onLeave()
    },
  }
}
