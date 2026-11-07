import { useEffect, useRef, useState } from 'react'
import Avatar from '../common/Avatar'
import { motion } from 'framer-motion'
import { MessageCircle, Send } from 'lucide-react'
import { useFlightStore } from '../../stores/flightStore'
import { useUserStore } from '../../stores/userStore'

const time = (ts: number) => new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

export default function ChatScreen() {
  const { messages, sendMessage, myId, flight, passengers } = useFlightStore()
  const markChatSeen = useUserStore(s => s.markChatSeen)
  const [text, setText] = useState('')
  const endRef = useRef<HTMLDivElement>(null)
  const global = messages.filter(m => !m.loftId)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
    markChatSeen()
  }, [global.length, markChatSeen])

  const send = () => {
    if (!text.trim()) return
    sendMessage(text)
    setText('')
  }

  const online = passengers.filter(p => p.status === 'online' && p.id !== myId).length

  return (
    <div className="w-full h-full flex flex-col">
      <div className="px-4 py-3 border-b border-ink-700/50 flex items-center gap-2">
        <MessageCircle className="w-5 h-5 text-sea-400" />
        <div>
          <h2 className="font-bold text-sea-300 leading-tight">Flight {flight?.flightNumber} chat</h2>
          <p className="text-xs text-ink-400">Everyone on board · {online} online</p>
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto px-4 py-3 space-y-3" aria-live="polite">
        {global.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center text-ink-400">
            <MessageCircle className="w-12 h-12 text-ink-600 mb-3" />
            <p>No messages yet</p>
            <p className="text-xs text-ink-500 mt-1">Say hello to the cabin!</p>
          </div>
        ) : (
          global.map(m => {
            const mine = m.senderId === myId
            return (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-2 ${mine ? 'flex-row-reverse' : ''}`}
              >
                <Avatar emoji={m.senderAvatar} size={32} className="shrink-0 mt-4" />
                <div className={`max-w-[75%] ${mine ? 'items-end' : 'items-start'} flex flex-col`}>
                  <span className="text-[11px] text-ink-400 mb-0.5 px-1">
                    {mine ? 'You' : m.senderName} · {time(m.timestamp)}
                  </span>
                  <p
                    className={`rounded-2xl px-3 py-2 text-sm break-words ${
                      mine ? 'bg-sea-400 text-ink-950 rounded-tr-sm' : 'glass text-ink-100 rounded-tl-sm'
                    }`}
                  >
                    {m.text}
                  </p>
                </div>
              </motion.div>
            )
          })
        )}
        <div ref={endRef} />
      </div>

      <div className="glass border-t border-ink-700/50 p-3 flex gap-2">
        <input
          type="text"
          placeholder="Say hello…"
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              send()
            }
          }}
          aria-label="Message the whole flight"
          maxLength={280}
          className="input-base flex-1"
        />
        <button onClick={send} className="btn-primary px-3" aria-label="Send">
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
