import { useEffect, useState } from 'react'
import Avatar from '../common/Avatar'
import { motion } from 'framer-motion'
import { LogOut, MessageCircle, Music2, Paintbrush, Plane, Users } from 'lucide-react'
import { useFlightStore } from '../../stores/flightStore'
import { useUserStore } from '../../stores/userStore'
import { useLoftStore } from '../../stores/loftStore'
import { useAudioStore } from '../../stores/audioStore'

export default function HomeScreen() {
  const { flight, passengers, myId, mode, leave } = useFlightStore()
  const { name, avatar, setPage } = useUserStore()
  const furnitureCount = useLoftStore(s => s.furniture.length)
  const nowPlaying = useLoftStore(s => s.nowPlaying)
  const stopMusic = useAudioStore(s => s.stop)
  // Two-tap confirm in the page itself (some in-app browsers block window.confirm).
  const [confirmLeave, setConfirmLeave] = useState(false)
  useEffect(() => {
    if (!confirmLeave) return
    const t = window.setTimeout(() => setConfirmLeave(false), 4000)
    return () => window.clearTimeout(t)
  }, [confirmLeave])
  if (!flight) return null

  const others = passengers.filter(p => p.id !== myId)
  const online = others.filter(p => p.status === 'online').length

  const actions = [
    { icon: Paintbrush, title: 'Design your loft', desc: `${furnitureCount} items placed`, page: 'loft' as const },
    { icon: Users, title: 'Visit neighbours', desc: `${others.length} lofts on board`, page: 'passengers' as const },
    { icon: Music2, title: 'Set the vibe', desc: nowPlaying ? `♪ ${nowPlaying.title}` : 'Nothing playing', page: 'loft' as const },
    { icon: MessageCircle, title: 'Cabin chat', desc: `${online} online now`, page: 'chat' as const },
  ]

  return (
    <div className="p-4 space-y-4">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="text-center pt-2">
        <Avatar emoji={avatar} size={72} className="mb-2 animate-float" />
        <h2 className="text-2xl font-bold text-ink-50">Welcome aboard, {name || 'traveller'}</h2>
        <p className="text-ink-400 text-sm mt-1">
          {online} {online === 1 ? 'neighbour is' : 'neighbours are'} online on your flight
        </p>
      </motion.div>

      {/* Boarding pass */}
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.08 }}
        className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-jasper-600/40 via-ink-800/80 to-sea-600/30 border border-white/10 shadow-xl shadow-black/40"
      >
        <div className="p-4 flex items-start justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-widest text-sea-200/80">{flight.airline}</p>
            <p className="text-xl font-bold text-white">{flight.flightNumber}</p>
          </div>
          <span
            className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full ${
              mode === 'live' ? 'bg-jade-400/20 text-jade-300' : 'bg-ocher-400/20 text-ocher-200'
            }`}
          >
            {mode === 'live' ? 'Live' : 'Demo'}
          </span>
        </div>
        <div className="px-4 pb-4 flex items-center gap-3">
          <div>
            <p className="text-3xl font-bold text-white tracking-wide">{flight.departureAirport || '———'}</p>
            <p className="text-[11px] text-ink-300">From</p>
          </div>
          <div className="flex-1 flex items-center gap-1 text-sea-300">
            <span className="flex-1 border-t border-dashed border-sea-300/50" />
            <Plane className="w-5 h-5 animate-float" />
            <span className="flex-1 border-t border-dashed border-sea-300/50" />
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-white tracking-wide">{flight.arrivalAirport || '———'}</p>
            <p className="text-[11px] text-ink-300">To</p>
          </div>
        </div>
        <div className="border-t border-dashed border-white/20 px-4 py-3 grid grid-cols-3 text-center">
          <div>
            <p className="text-[10px] uppercase text-ink-400">Seat</p>
            <p className="font-semibold text-white">{flight.seatNumber || '—'}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase text-ink-400">Date</p>
            <p className="font-semibold text-white text-sm">{flight.date}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase text-ink-400">Lofts</p>
            <p className="font-semibold text-white">{others.length + 1}</p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-2 gap-3">
        {actions.map((a, i) => (
          <motion.button
            key={a.title}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12 + i * 0.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setPage(a.page)}
            className="glass rounded-2xl p-4 text-left hover:border-sea-400/50 hover:bg-sea-400/5"
          >
            <a.icon className="w-6 h-6 text-sea-400 mb-2" />
            <p className="font-semibold text-ink-100 text-sm">{a.title}</p>
            <p className="text-xs text-ink-400 truncate">{a.desc}</p>
          </motion.button>
        ))}
      </div>

      {mode === 'demo' && (
        <p className="text-xs text-ink-400 text-center px-4">
          You’re flying with demo neighbours. Connect Firebase to meet the real passengers on your flight — see the README.
        </p>
      )}

      <button
        onClick={() => {
          if (!confirmLeave) {
            setConfirmLeave(true)
            return
          }
          stopMusic()
          leave()
        }}
        className={`w-full py-3 text-sm flex items-center justify-center gap-2 rounded-xl transition-colors ${
          confirmLeave ? 'bg-jasper-500/15 text-jasper-300' : 'text-ink-400 hover:text-jasper-300'
        }`}
      >
        <LogOut className="w-4 h-4" /> {confirmLeave ? 'Tap again to leave — your loft stays saved' : 'Leave flight'}
      </button>
    </div>
  )
}
