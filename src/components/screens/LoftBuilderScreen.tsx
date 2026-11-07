import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, Paintbrush, Save, Send } from 'lucide-react'
import toast from 'react-hot-toast'
import { useLoftStore } from '../../stores/loftStore'
import { allTracks, findTrack, useAudioStore } from '../../stores/audioStore'
import { useFlightStore } from '../../stores/flightStore'
import { useUserStore } from '../../stores/userStore'
import { useMyMusic } from '../../hooks/useMyMusic'
import { useRoomPresence } from '../../hooks/useRoomPresence'
import { celebrate } from '../../lib/celebrate'
import RoomStage from '../loft/RoomStage'
import DecorateSheet from '../loft/DecorateSheet'
import ItemToolbar from '../loft/ItemToolbar'

const timeAgo = (ts: number | null) => {
  if (!ts) return 'not saved yet'
  const s = Math.round((Date.now() - ts) / 1000)
  if (s < 10) return 'saved'
  if (s < 60) return `saved ${s}s ago`
  return `saved ${Math.round(s / 60)}m ago`
}

export default function LoftBuilderScreen() {
  const loft = useLoftStore()
  const { uploads, currentTrackId, playing } = useAudioStore()
  const toggleTrack = useMyMusic()
  const { myId, sendMessage, demoDropBy, mode } = useFlightStore()
  const { celebratedSave, markSaveCelebrated } = useUserStore()
  const [sheetOpen, setSheetOpen] = useState(false)
  const [reply, setReply] = useState('')
  const [, tick] = useState(0)

  const visitors = useRoomPresence(myId, { includeOwner: false })
  const selected = loft.furniture.find(f => f.id === loft.selectedId)
  const playingId = playing ? currentTrackId : null
  const tracks = allTracks(uploads)

  // Everything autosaves; this just keeps the "saved Xs ago" label fresh.
  useEffect(() => {
    const t = window.setInterval(() => tick(n => n + 1), 15000)
    return () => window.clearInterval(t)
  }, [])

  // Desktop shortcuts for the selected item.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const id = useLoftStore.getState().selectedId
      if (!id || (e.target as HTMLElement)?.tagName === 'INPUT') return
      const s = useLoftStore.getState()
      if (e.key === 'Delete' || e.key === 'Backspace') s.removeItem(id)
      else if (e.key.toLowerCase() === 'r') s.rotateItem(id)
      else if (e.key === '+' || e.key === '=') s.resizeItem(id, 0.15)
      else if (e.key === '-') s.resizeItem(id, -0.15)
      else if (e.key === 'Escape') s.select(null)
      else return
      e.preventDefault()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const handleSave = () => {
    loft.markSaved()
    loft.select(null)
    toast.success(mode === 'live' ? 'Loft saved & shared with your flight' : 'Loft saved', { icon: '💾' })
    if (!celebratedSave) {
      celebrate()
      markSaveCelebrated()
    }
    demoDropBy()
  }

  const sendReply = () => {
    if (!reply.trim()) return
    sendMessage(reply, myId)
    setReply('')
  }

  return (
    <div className="relative w-full h-full flex flex-col">
      <div className="flex items-center justify-between gap-2 px-4 py-3 border-b border-slate-700/50">
        <div className="min-w-0">
          <h2 className="font-bold text-cyan-300 leading-tight">My Loft</h2>
          <p className="text-xs text-slate-400 flex items-center gap-1 whitespace-nowrap overflow-hidden">
            {loft.furniture.length} items · <Check className="w-3 h-3 text-emerald-400" /> {loft.savedAt ? timeAgo(loft.savedAt) : 'autosaving'}
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setSheetOpen(true)} className="btn-secondary flex items-center gap-1.5 text-sm">
            <Paintbrush className="w-4 h-4" /> Decorate
          </button>
          <button onClick={handleSave} className="btn-primary flex items-center gap-1.5 text-sm">
            <Save className="w-4 h-4" /> Save
          </button>
        </div>
      </div>

      <AnimatePresence>
        {visitors.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="px-4 py-2 bg-cyan-500/10 border-b border-cyan-500/20 flex items-center gap-2"
          >
            <span className="text-xs text-cyan-200 whitespace-nowrap">
              {visitors.map(v => v.emoji).join('')} {visitors.length === 1 ? `${visitors[0].name} is visiting` : `${visitors.length} visitors`}
            </span>
            <input
              value={reply}
              onChange={e => setReply(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendReply()}
              placeholder="Say hi…"
              aria-label="Say something to your visitors"
              className="input-base py-1 text-sm flex-1 min-w-0"
            />
            <button onClick={sendReply} className="p-1.5 rounded-lg bg-cyan-400 text-slate-950" aria-label="Send">
              <Send className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative flex-1 min-h-0 px-3 pt-3 pb-10">
        <RoomStage
          furniture={loft.furniture}
          wallpaper={loft.wallpaper}
          flooring={loft.flooring}
          tracks={tracks}
          playingTrackId={playingId}
          editable
          selectedId={loft.selectedId}
          avatars={visitors}
          onSelect={loft.select}
          onMove={loft.moveItem}
          onActivate={item => item.trackId && toggleTrack(item.trackId)}
        />

        <AnimatePresence>
          {selected ? (
            <ItemToolbar
              key="toolbar"
              item={selected}
              trackTitle={findTrack(selected.trackId, uploads)?.title}
              isPlaying={selected.trackId === playingId}
              onRotate={() => loft.rotateItem(selected.id)}
              onResize={d => loft.resizeItem(selected.id, d)}
              onForward={() => loft.bringForward(selected.id)}
              onDelete={() => loft.removeItem(selected.id)}
              onTogglePlay={() => selected.trackId && toggleTrack(selected.trackId)}
            />
          ) : loft.furniture.length === 0 ? (
            <motion.p key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute bottom-3 inset-x-0 text-center text-sm text-slate-300">
              Your loft is empty — tap <span className="text-cyan-300 font-semibold">Decorate</span> to start
            </motion.p>
          ) : (
            <motion.p key="hint" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute bottom-3 inset-x-0 px-4 text-center text-xs text-slate-400 pointer-events-none truncate">
              Drag to move · tap an item to rotate, resize or remove · double-tap an album to play
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      <DecorateSheet open={sheetOpen} onClose={() => setSheetOpen(false)} onToggleTrack={toggleTrack} />
    </div>
  )
}
