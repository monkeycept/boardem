import { motion } from 'framer-motion'
import Avatar from '../common/Avatar'
import { Music2, Users } from 'lucide-react'
import { useFlightStore } from '../../stores/flightStore'
import { useUserStore } from '../../stores/userStore'
import { useLoftStore } from '../../stores/loftStore'

export default function PassengersScreen() {
  const { passengers, lofts, myId, visit, mode, flight } = useFlightStore()
  const { name, avatar, setPage } = useUserStore()
  const myTrack = useLoftStore(s => s.nowPlaying)

  const others = passengers
    .filter(p => p.id !== myId)
    .sort((a, b) => (a.status === b.status ? a.name.localeCompare(b.name) : a.status === 'online' ? -1 : 1))
  const onlineCount = others.filter(p => p.status === 'online').length

  return (
    <div className="w-full min-h-full flex flex-col">
      <div className="px-4 py-3 border-b border-ink-700/50 flex items-center gap-2">
        <Users className="w-5 h-5 text-sea-400" />
        <div>
          <h2 className="font-bold text-sea-300 leading-tight">Flight {flight?.flightNumber} passengers</h2>
          <p className="text-xs text-ink-400">
            {onlineCount} online{mode === 'demo' ? ' · demo neighbours' : ''}
          </p>
        </div>
      </div>

      <div className="p-4 grid grid-cols-2 gap-3">
        <motion.button
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => setPage('loft')}
          className="col-span-2 glass rounded-2xl p-3 flex items-center gap-3 text-left border-sea-500/40 hover:bg-sea-500/10"
        >
          <Avatar emoji={avatar} size={48} />
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-ink-100">{name || 'You'} <span className="text-xs font-normal text-sea-300">(you · seat {flight?.seatNumber || '—'})</span></p>
            <p className="text-xs text-ink-400 truncate">
              {myTrack ? `♪ ${myTrack.title}` : 'No music playing in your loft'}
            </p>
          </div>
          <span className="text-xs font-medium text-sea-300">Edit loft →</span>
        </motion.button>

        {others.length === 0 && (
          <div className="col-span-2 text-center py-10 text-ink-400">
            <p className="text-4xl mb-2">🛫</p>
            <p>No one else from {flight?.flightNumber} is here yet.</p>
            <p className="text-xs mt-1">Share the app with fellow passengers — they’ll show up here.</p>
          </div>
        )}

        {others.map((p, idx) => {
          const loft = lofts[p.loftId]
          const online = p.status === 'online'
          return (
            <motion.button
              key={p.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.04 * idx }}
              whileTap={{ scale: 0.97 }}
              onClick={() => visit(p.loftId)}
              disabled={!loft}
              className={`glass rounded-2xl p-3 text-center flex flex-col items-center gap-1 hover:border-sea-500/50 hover:bg-sea-500/10 disabled:opacity-50 ${online ? '' : 'opacity-70'}`}
            >
              <span className="relative text-5xl leading-none mt-1">
                <Avatar emoji={p.avatar} size={60} />
                <span
                  className={`absolute -right-1 bottom-0 w-3.5 h-3.5 rounded-full ring-2 ring-ink-900 ${online ? 'bg-jade-400' : 'bg-ink-500'}`}
                  aria-label={online ? 'online' : 'offline'}
                />
              </span>
              <span className="font-semibold text-ink-100 mt-1">{p.name}</span>
              <span className="text-[11px] text-ink-400">
                {p.seat ? `Seat ${p.seat} · ` : ''}
                {online ? 'online' : 'away'}
              </span>
              {p.vibe && <span className="text-[11px] text-ink-300 line-clamp-1">{p.vibe}</span>}
              {loft?.currentlyPlaying && (
                <span className="text-[11px] text-sea-300 flex items-center gap-1 max-w-full">
                  <Music2 className="w-3 h-3 shrink-0" /> <span className="truncate">{loft.currentlyPlaying.title}</span>
                </span>
              )}
              <span className="mt-1 text-xs font-semibold text-sea-300">{loft ? 'Visit loft →' : 'No loft yet'}</span>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
