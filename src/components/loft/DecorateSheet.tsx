import { useRef, useState } from 'react'
import { FURNITURE_ART } from '../../lib/art'
import { AnimatePresence, motion } from 'framer-motion'
import { Frame, Music, Pause, Play, Upload, X } from 'lucide-react'
import toast from 'react-hot-toast'
import { FLOORS, FURNITURE_CATALOG, WALLPAPERS } from '../../lib/room'
import { useLoftStore } from '../../stores/loftStore'
import { allTracks, useAudioStore } from '../../stores/audioStore'
import AlbumThumb from '../common/AlbumThumb'

type Tab = 'furniture' | 'music' | 'wall' | 'floor'

const TABS: { id: Tab; label: string }[] = [
  { id: 'furniture', label: 'Furniture' },
  { id: 'music', label: 'Music' },
  { id: 'wall', label: 'Walls' },
  { id: 'floor', label: 'Floors' },
]

interface Props {
  open: boolean
  onClose: () => void
  onToggleTrack: (trackId: string) => void
}

export default function DecorateSheet({ open, onClose, onToggleTrack }: Props) {
  const [tab, setTab] = useState<Tab>('furniture')
  const fileRef = useRef<HTMLInputElement>(null)
  const { addItem, wallpaper, flooring, setWallpaper, setFlooring } = useLoftStore()
  const { uploads, currentTrackId, playing, addUpload } = useAudioStore()
  const tracks = allTracks(uploads)

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    if (!file.type.startsWith('audio/')) {
      toast.error('That file isn’t audio — try an MP3')
      return
    }
    const track = addUpload(file)
    onToggleTrack(track.id)
    toast.success(`Added “${track.title}”`, { icon: '🎵' })
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="absolute inset-0 z-30 bg-ink-950/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.section
            role="dialog"
            aria-label="Decorate your loft"
            className="absolute inset-x-0 bottom-0 z-40 glass-dark rounded-t-3xl max-h-[62%] flex flex-col shadow-2xl shadow-black/60"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
          >
            <div className="flex items-center justify-between px-4 pt-3">
              <div className="w-10 h-1 rounded-full bg-ink-600 absolute left-1/2 -translate-x-1/2 top-2" />
              <div className="flex gap-1 mt-2" role="tablist">
                {TABS.map(t => (
                  <button
                    key={t.id}
                    role="tab"
                    aria-selected={tab === t.id}
                    onClick={() => setTab(t.id)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      tab === t.id ? 'bg-sea-400 text-ink-950' : 'text-ink-300 hover:bg-ink-800'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
              <button onClick={onClose} className="mt-2 p-2 rounded-full text-ink-400 hover:text-white hover:bg-ink-800" aria-label="Close">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto p-4 pb-6">
              {tab === 'furniture' && (
                <>
                  <div className="grid grid-cols-4 gap-2">
                    {FURNITURE_CATALOG.map(item => (
                      <motion.button
                        key={item.type}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => {
                          addItem(item.type)
                          toast.success(`${item.label} added`, { icon: item.emoji, duration: 1200 })
                        }}
                        className="glass rounded-xl py-3 flex flex-col items-center gap-1 hover:border-sea-400/60 hover:bg-sea-400/10"
                      >
                        {FURNITURE_ART[item.type] ? (
                          <img src={FURNITURE_ART[item.type]} alt="" className="w-10 h-10 object-contain" draggable={false} />
                        ) : (
                          <span className="text-3xl leading-none h-10 flex items-center">{item.emoji}</span>
                        )}
                        <span className="text-[11px] text-ink-300">{item.label}</span>
                      </motion.button>
                    ))}
                  </div>
                  <p className="text-xs text-ink-400 text-center mt-4">Tap to add · drag it into place · tap it again for more options</p>
                </>
              )}

              {tab === 'music' && (
                <div className="space-y-2">
                  <p className="text-xs text-ink-400 mb-1">
                    Whatever plays in your loft plays for visitors too. Hang an album on your wall so people can tap it.
                  </p>
                  {tracks.map(track => {
                    const isOn = playing && currentTrackId === track.id
                    return (
                      <div key={track.id} className="glass rounded-xl p-2 flex items-center gap-3">
                        <AlbumThumb track={track} spinning={isOn} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-ink-100 truncate">{track.title}</p>
                          <p className="text-xs text-ink-400 truncate">
                            {track.artist} · {track.vibe}
                          </p>
                        </div>
                        <button
                          onClick={() => {
                            addItem('album', { trackId: track.id })
                            toast.success('Album hung on your wall', { icon: '🖼️', duration: 1400 })
                          }}
                          className="p-2 rounded-lg text-ink-300 hover:text-sea-300 hover:bg-ink-800"
                          aria-label={`Hang ${track.title} on the wall`}
                          title="Hang on wall"
                        >
                          <Frame className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => onToggleTrack(track.id)}
                          className={`p-2 rounded-full ${isOn ? 'bg-sea-400 text-ink-950' : 'bg-ink-700 text-sea-300'}`}
                          aria-label={isOn ? `Pause ${track.title}` : `Play ${track.title}`}
                        >
                          {isOn ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        </button>
                      </div>
                    )
                  })}
                  <button
                    onClick={() => fileRef.current?.click()}
                    className="w-full mt-2 py-3 rounded-xl border border-dashed border-ink-600 text-ink-300 hover:border-sea-400 hover:text-sea-300 flex items-center justify-center gap-2"
                  >
                    <Upload className="w-4 h-4" /> Upload your own MP3
                  </button>
                  <p className="text-[11px] text-ink-500 text-center flex items-center justify-center gap-1">
                    <Music className="w-3 h-3" /> Uploaded songs stay on your device — visitors see the title only.
                  </p>
                  <input ref={fileRef} type="file" accept="audio/*" className="hidden" onChange={handleUpload} />
                </div>
              )}

              {tab === 'wall' && (
                <div className="grid grid-cols-4 gap-3">
                  {WALLPAPERS.map(wp => (
                    <button key={wp.id} onClick={() => setWallpaper(wp.id)} className="flex flex-col items-center gap-1">
                      <span
                        className={`w-full h-14 rounded-xl border-2 ${wallpaper === wp.id ? 'border-sea-400 ring-2 ring-sea-400/40' : 'border-ink-700'}`}
                        style={{ background: `linear-gradient(180deg, ${wp.top}, ${wp.bottom})` }}
                      />
                      <span className="text-[11px] text-ink-300">{wp.label}</span>
                    </button>
                  ))}
                </div>
              )}

              {tab === 'floor' && (
                <div className="grid grid-cols-4 gap-3">
                  {FLOORS.map(fl => (
                    <button key={fl.id} onClick={() => setFlooring(fl.id)} className="flex flex-col items-center gap-1">
                      <span
                        className={`w-full h-14 rounded-xl border-2 ${flooring === fl.id ? 'border-sea-400 ring-2 ring-sea-400/40' : 'border-ink-700'}`}
                        style={{
                          backgroundColor: fl.base,
                          backgroundImage: `repeating-linear-gradient(0deg, ${fl.line} 0 2px, transparent 2px 14px)`,
                        }}
                      />
                      <span className="text-[11px] text-ink-300">{fl.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </motion.section>
        </>
      )}
    </AnimatePresence>
  )
}
