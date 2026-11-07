import { AnimatePresence, motion } from 'framer-motion'
import { Square } from 'lucide-react'
import { findTrack, useAudioStore } from '../../stores/audioStore'
import { useLoftStore } from '../../stores/loftStore'
import AlbumThumb from './AlbumThumb'

/** Mini player shown above the tab bar whenever your loft is playing music. */
export default function NowPlayingBar() {
  const { playing, currentTrackId, uploads, stop } = useAudioStore()
  const setNowPlaying = useLoftStore(s => s.setNowPlaying)
  const track = playing ? findTrack(currentTrackId, uploads) : undefined

  return (
    <AnimatePresence>
      {track && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="overflow-hidden"
        >
          <div className="mx-3 mb-2 rounded-xl bg-ink-800/90 border border-ink-700/60 p-2 flex items-center gap-3">
            <AlbumThumb track={track} size={34} spinning />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-ink-100 truncate">{track.title}</p>
              <p className="text-[11px] text-ink-400 truncate">{track.artist} · playing in your loft</p>
            </div>
            <div className="flex items-end gap-0.5 h-4 mr-1" aria-hidden>
              {[0, 1, 2, 3].map(i => (
                <span key={i} className="w-0.5 bg-sea-400 rounded-full animate-eq" style={{ animationDelay: `${i * 0.15}s` }} />
              ))}
            </div>
            <button
              onClick={() => {
                stop()
                setNowPlaying(null)
              }}
              className="p-2 rounded-full bg-ink-700 text-ink-200 hover:text-white"
              aria-label="Stop music"
            >
              <Square className="w-3.5 h-3.5" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
