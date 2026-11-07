import { useEffect, useRef, useState } from 'react'
import Avatar from '../common/Avatar'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, Paintbrush, Save, Send, Waves } from 'lucide-react'
import toast from 'react-hot-toast'
import { useLoftStore } from '../../stores/loftStore'
import { allTracks, findTrack, useAudioStore } from '../../stores/audioStore'
import { useFlightStore } from '../../stores/flightStore'
import { useUserStore } from '../../stores/userStore'
import { useMyMusic } from '../../hooks/useMyMusic'
import { useRoomPresence } from '../../hooks/useRoomPresence'
import { useRoomPhysics } from '../../hooks/useRoomPhysics'
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

  const applyPoses = loft.applyPoses
  const physics = useRoomPhysics({ getItems: () => useLoftStore.getState().furniture, onSettle: applyPoses })

  // New furniture falls in from above and lands with a thump.
  const knownIds = useRef(new Set(loft.furniture.map(f => f.id)))
  useEffect(() => {
    const added = loft.furniture.filter(f => !knownIds.current.has(f.id)).map(f => f.id)
    knownIds.current = new Set(loft.furniture.map(f => f.id))
    if (added.length) physics.drop(added)
  }, [loft.furniture, physics])

  const shakeRoom = () => {
    const before = useLoftStore.getState().furniture
    loft.select(null)
    physics.turbulence(1)
    // Physics may knock things over — offer a way back.
    window.setTimeout(() => {
      toast(
        t => (
          <span className="flex items-center gap-3">
            Turbulence shook your loft
            <button
              className="text-sea-300 font-semibold"
              onClick={() => {
                physics.reset()
                useLoftStore.getState().replaceFurniture(before)
                toast.dismiss(t.id)
              }}
            >
              Undo
            </button>
          </span>
        ),
        { icon: '🌀', duration: 6000 },
      )
    }, 2500)
  }

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
      <div className="flex items-center justify-between gap-2 px-4 py-3 border-b border-ink-700/50">
        <div className="min-w-0">
          <h2 className="font-bold text-sea-300 leading-tight">My Loft</h2>
          <p className="text-xs text-ink-400 flex items-center gap-1 whitespace-nowrap overflow-hidden">
            {loft.furniture.length} items · <Check className="w-3 h-3 text-jade-400" /> {loft.savedAt ? timeAgo(loft.savedAt) : 'autosaving'}
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
            className="px-4 py-2 bg-sea-500/10 border-b border-sea-500/20 flex items-center gap-2"
          >
            <span className="text-xs text-sea-200 whitespace-nowrap">
              {visitors.map(v => <Avatar key={v.id} emoji={v.emoji} size={20} className="-mr-1 align-middle" />)} {visitors.length === 1 ? `${visitors[0].name} is visiting` : `${visitors.length} visitors`}
            </span>
            <input
              value={reply}
              onChange={e => setReply(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendReply()}
              placeholder="Say hi…"
              aria-label="Say something to your visitors"
              className="input-base py-1 text-sm flex-1 min-w-0"
            />
            <button onClick={sendReply} className="p-1.5 rounded-lg bg-sea-400 text-ink-950" aria-label="Send">
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
          onMove={(id, x, y) => {
            loft.moveItem(id, x, y)
            physics.nudge(id)
          }}
          onActivate={item => item.trackId && toggleTrack(item.trackId)}
          poses={physics.poses}
          locked={physics.running}
          shaking={physics.shaking}
        />

        <button
          onClick={shakeRoom}
          disabled={physics.running}
          className="absolute top-5 right-5 z-10 flex items-center gap-1.5 rounded-full bg-ink-950/75 backdrop-blur px-3 py-1.5 text-xs font-semibold text-jasper-300 ring-1 ring-jasper-400/40 hover:bg-ink-900 disabled:opacity-50"
          aria-label="Shake the loft with turbulence"
        >
          <Waves className="w-4 h-4" /> Turbulence
        </button>

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
            <motion.p key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute bottom-3 inset-x-0 text-center text-sm text-ink-300">
              Your loft is empty — tap <span className="text-sea-300 font-semibold">Decorate</span> to start
            </motion.p>
          ) : (
            <motion.p key="hint" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute bottom-3 inset-x-0 px-4 text-center text-xs text-ink-400 pointer-events-none truncate">
              Drag to move · tap an item to rotate, resize or remove · double-tap an album to play
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      <DecorateSheet open={sheetOpen} onClose={() => setSheetOpen(false)} onToggleTrack={toggleTrack} />
    </div>
  )
}
