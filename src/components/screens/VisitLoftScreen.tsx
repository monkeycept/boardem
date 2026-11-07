import { useEffect, useMemo, useRef, useState } from 'react'
import Avatar from '../common/Avatar'
import { motion } from 'framer-motion'
import { ArrowLeft, Footprints, Pause, Play, Send, Volume2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { useFlightStore } from '../../stores/flightStore'
import { useUserStore } from '../../stores/userStore'
import { allTracks, findTrack, useAudioStore } from '../../stores/audioStore'
import { useRoomPresence } from '../../hooks/useRoomPresence'
import { useRoomPhysics } from '../../hooks/useRoomPhysics'
import { celebrate } from '../../lib/celebrate'
import { getPresetTrack } from '../../lib/tracks'
import RoomStage from '../loft/RoomStage'
import AlbumThumb from '../common/AlbumThumb'

export default function VisitLoftScreen() {
  const { visitingLoftId, lofts, passengers, myPos, walkTo, exitVisit, sendMessage, messages, myId } = useFlightStore()
  const { name, avatar, markVisited, setPage } = useUserStore()
  const { uploads, currentTrackId, playing, play, stop } = useAudioStore()
  const [text, setText] = useState('')
  const resumeRef = useRef<string | null>(null)

  const loft = visitingLoftId ? lofts[visitingLoftId] : undefined
  const owner = passengers.find(p => p.id === visitingLoftId)
  const hostTrackId = loft?.currentlyPlaying?.trackId ?? null
  const hostTrack = findTrack(hostTrackId, uploads) ?? (hostTrackId ? getPresetTrack(hostTrackId) : undefined)
  const hostTrackPlayable = Boolean(hostTrackId && getPresetTrack(hostTrackId))

  const me = useMemo(() => ({ id: myId, emoji: avatar, name: name || 'You', x: myPos.x, y: myPos.y, isMe: true }), [myId, avatar, name, myPos.x, myPos.y])
  const avatars = useRoomPresence(visitingLoftId ?? '', { includeOwner: true, me })

  // Someone else's loft: physics only plays out on your screen and is never saved.
  const loftRef = useRef(loft)
  loftRef.current = loft
  const physics = useRoomPhysics({ getItems: () => loftRef.current?.furniture ?? [] })
  const { turbulence, reset } = physics
  useEffect(() => {
    reset()
    if (!visitingLoftId) return
    let timer = 0
    const schedule = () => {
      timer = window.setTimeout(() => {
        toast('Light turbulence — the seatbelt sign is on', { icon: '🌀', duration: 2500 })
        turbulence(0.55)
        schedule()
      }, 35000 + Math.random() * 35000)
    }
    schedule()
    return () => window.clearTimeout(timer)
  }, [visitingLoftId, turbulence, reset])

  // On arrival: celebrate first visits and put the host's music on. On leaving: restore your own.
  useEffect(() => {
    if (!visitingLoftId) return
    const audio = useAudioStore.getState()
    resumeRef.current = audio.playing ? audio.currentTrackId : null
    if (markVisited(visitingLoftId)) celebrate('small')
    const loftTrack = useFlightStore.getState().lofts[visitingLoftId]?.currentlyPlaying?.trackId
    if (loftTrack && getPresetTrack(loftTrack)) audio.play(loftTrack)
    else audio.stop()
    return () => {
      const a = useAudioStore.getState()
      a.stop()
      if (resumeRef.current) a.play(resumeRef.current)
    }
  }, [visitingLoftId, markVisited])

  const roomLog = messages.filter(m => m.loftId === visitingLoftId).slice(-3)

  if (!visitingLoftId || !loft) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center gap-4 p-6 text-center">
        <p className="text-ink-300">This loft hasn’t been decorated yet.</p>
        <button
          className="btn-primary"
          onClick={() => {
            exitVisit()
            setPage('passengers')
          }}
        >
          Back to passengers
        </button>
      </div>
    )
  }

  const handleExit = () => {
    exitVisit()
    setPage('passengers')
  }

  const send = () => {
    if (!text.trim()) return
    sendMessage(text, visitingLoftId)
    setText('')
  }

  const playingId = playing ? currentTrackId : null

  return (
    <div className="w-full h-full flex flex-col bg-sky-night">
      <header className="glass border-b border-ink-700/50 px-3 py-2.5 flex items-center gap-2">
        <button onClick={handleExit} className="btn-ghost flex items-center gap-1 px-2" aria-label="Leave loft">
          <ArrowLeft className="w-4 h-4" /> Leave
        </button>
        <div className="flex-1 text-center min-w-0">
          <p className="font-bold text-sea-300 truncate">
            {owner && <Avatar emoji={owner.avatar} size={22} className="align-text-bottom mr-1" />}{loft.ownerName}’s Loft
          </p>
          <p className="text-[11px] text-ink-400 truncate">
            {owner?.status === 'online' ? 'Home now' : 'Not home'} · {avatars.length - 1} {avatars.length - 1 === 1 ? 'person' : 'people'} here with you
          </p>
        </div>
        <div className="w-[72px]" />
      </header>

      {hostTrack && (
        <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} className="mx-3 mt-3 glass rounded-xl p-2 flex items-center gap-3">
          <AlbumThumb track={hostTrack} size={36} spinning={playingId === hostTrackId} />
          <div className="flex-1 min-w-0">
            <p className="text-[11px] text-ink-400 flex items-center gap-1">
              <Volume2 className="w-3 h-3 text-sea-400" /> {hostTrackPlayable ? 'Playing in this loft' : 'Playing on their device'}
            </p>
            <p className="text-sm font-semibold text-ink-100 truncate">
              {hostTrack.title} <span className="font-normal text-ink-400">· {hostTrack.artist}</span>
            </p>
          </div>
          {hostTrackPlayable && (
            <button
              onClick={() => (playingId === hostTrackId ? stop() : play(hostTrackId!))}
              className="p-2 rounded-full bg-ink-700 text-sea-300"
              aria-label={playingId === hostTrackId ? 'Pause' : 'Play'}
            >
              {playingId === hostTrackId ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
          )}
        </motion.div>
      )}

      <div className="relative flex-1 min-h-0 px-3 pt-3 pb-10">
        <RoomStage
          furniture={loft.furniture}
          wallpaper={loft.wallpaper}
          flooring={loft.flooring}
          tracks={allTracks(uploads)}
          playingTrackId={playingId}
          avatars={avatars}
          poses={physics.poses}
          shaking={physics.shaking}
          onFloorTap={walkTo}
          onActivate={item => {
            if (item.type !== 'album' || !item.trackId) return
            if (!getPresetTrack(item.trackId)) {
              toast('That song lives on their device', { icon: '🎧' })
              return
            }
            if (playingId === item.trackId) stop()
            else play(item.trackId)
          }}
        />
        <p className="absolute bottom-3 inset-x-0 text-center text-[11px] text-ink-400 pointer-events-none flex items-center justify-center gap-1">
          <Footprints className="w-3 h-3" /> Tap the floor to walk · tap an album to listen
        </p>
      </div>

      <div className="glass border-t border-ink-700/50 px-3 pt-2 pb-3 space-y-2">
        {roomLog.length > 0 && (
          <div className="space-y-0.5 text-xs" aria-live="polite">
            {roomLog.map(m => (
              <p key={m.id} className="truncate text-ink-300">
                <span className="font-semibold text-sea-300">{m.senderName}:</span> {m.text}
              </p>
            ))}
          </div>
        )}
        <div className="flex gap-2">
          <input
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && send()}
            placeholder={`Say something to ${loft.ownerName}…`}
            aria-label="Message"
            className="input-base flex-1"
            maxLength={280}
          />
          <button onClick={send} className="btn-primary px-3" aria-label="Send">
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
