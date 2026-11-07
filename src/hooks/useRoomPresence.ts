import { useEffect, useMemo, useState } from 'react'
import { useFlightStore } from '../stores/flightStore'
import { RoomAvatar } from '../components/loft/AvatarNode'
import { ROOM_W, WALL_H } from '../lib/room'

const BUBBLE_MS = 7000

/** Everyone currently in a loft, with their latest speech bubble. */
export function useRoomPresence(loftId: string, opts: { includeOwner: boolean; me?: RoomAvatar }) {
  const passengers = useFlightStore(s => s.passengers)
  const messages = useFlightStore(s => s.messages)
  const myId = useFlightStore(s => s.myId)
  const [now, setNow] = useState(Date.now())

  useEffect(() => {
    const t = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(t)
  }, [])

  const avatars = useMemo(() => {
    const bubbles = new Map<string, string>()
    for (const m of messages) {
      if (m.loftId === loftId && now - m.timestamp < BUBBLE_MS) bubbles.set(m.senderId, m.text)
    }
    const list: RoomAvatar[] = []
    const owner = passengers.find(p => p.id === loftId)
    if (opts.includeOwner && owner && owner.status === 'online' && (!owner.visiting || owner.visiting === loftId)) {
      list.push({ id: owner.id, emoji: owner.avatar, name: owner.name, x: owner.x ?? ROOM_W * 0.3, y: owner.y ?? WALL_H + 110, bubble: bubbles.get(owner.id) })
    }
    for (const p of passengers) {
      if (p.id === myId || p.id === loftId || p.visiting !== loftId || p.status !== 'online') continue
      list.push({ id: p.id, emoji: p.avatar, name: p.name, x: p.x ?? ROOM_W / 2, y: p.y ?? WALL_H + 120, bubble: bubbles.get(p.id) })
    }
    if (opts.me) list.push({ ...opts.me, bubble: bubbles.get(myId) })
    return list
  }, [passengers, messages, loftId, myId, now, opts.includeOwner, opts.me])

  return avatars
}
