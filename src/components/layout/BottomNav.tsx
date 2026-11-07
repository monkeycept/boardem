import { motion } from 'framer-motion'
import { Home, MessageCircle, Paintbrush, Users } from 'lucide-react'
import { Page } from '../../types'
import { useUserStore } from '../../stores/userStore'
import { useFlightStore } from '../../stores/flightStore'

const NAV: { id: Page; label: string; icon: typeof Home }[] = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'loft', label: 'My Loft', icon: Paintbrush },
  { id: 'passengers', label: 'Passengers', icon: Users },
  { id: 'chat', label: 'Chat', icon: MessageCircle },
]

export default function BottomNav() {
  const { page, setPage, lastChatSeenAt } = useUserStore()
  const { messages, myId } = useFlightStore()
  const unread = page === 'chat' ? 0 : messages.filter(m => !m.loftId && m.senderId !== myId && m.timestamp > lastChatSeenAt).length

  return (
    <nav className="glass border-x-0 border-b-0 px-2 pt-1.5 pb-safe" aria-label="Main">
      <div className="grid grid-cols-4 gap-1">
        {NAV.map(item => {
          const active = page === item.id
          return (
            <button
              key={item.id}
              onClick={() => setPage(item.id)}
              aria-current={active ? 'page' : undefined}
              className={`relative flex flex-col items-center gap-0.5 py-2 rounded-xl transition-colors ${
                active ? 'text-sea-300' : 'text-ink-400 hover:text-ink-200'
              }`}
            >
              {active && (
                <motion.span layoutId="nav-pill" className="absolute inset-0 rounded-xl bg-sea-400/15 border border-sea-400/30" transition={{ type: 'spring', damping: 26, stiffness: 320 }} />
              )}
              <span className="relative">
                <item.icon className="w-5 h-5" />
                {item.id === 'chat' && unread > 0 && (
                  <span className="absolute -top-1.5 -right-2.5 min-w-[16px] h-4 px-1 rounded-full bg-jasper-500 text-white text-[10px] font-bold flex items-center justify-center">
                    {unread > 9 ? '9+' : unread}
                  </span>
                )}
              </span>
              <span className="relative text-[11px] font-medium">{item.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
