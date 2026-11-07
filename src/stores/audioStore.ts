import { create } from 'zustand'
import { Track } from '../types'
import { PRESET_TRACKS, getPresetTrack } from '../lib/tracks'
import { playFile, playRecipe, stopFile, stopRecipe, unlockAudio } from '../lib/audio'
import { uid } from '../lib/ids'

const UPLOAD_COLORS: [string, string][] = [
  ['#0891b2', '#f0abfc'],
  ['#4338ca', '#fda4af'],
  ['#15803d', '#fde047'],
]

interface AudioState {
  uploads: Track[]
  currentTrackId: string | null
  playing: boolean

  play: (trackId: string) => void
  stop: () => void
  toggle: (trackId: string) => void
  addUpload: (file: File) => Track
}

export const allTracks = (uploads: Track[]): Track[] => [...PRESET_TRACKS, ...uploads]

export const useAudioStore = create<AudioState>()((set, get) => ({
  uploads: [],
  currentTrackId: null,
  playing: false,

  play: trackId => {
    unlockAudio()
    const preset = getPresetTrack(trackId)
    const upload = get().uploads.find(t => t.id === trackId)
    if (preset) {
      stopFile()
      playRecipe(preset.recipe)
    } else if (upload?.url) {
      stopRecipe()
      playFile(upload.url)
    } else {
      return
    }
    set({ currentTrackId: trackId, playing: true })
  },
  stop: () => {
    stopRecipe()
    stopFile()
    set({ playing: false })
  },
  toggle: trackId => {
    const { currentTrackId, playing } = get()
    if (playing && currentTrackId === trackId) get().stop()
    else get().play(trackId)
  },
  addUpload: file => {
    const title = file.name.replace(/\.[^.]+$/, '').replace(/[_-]+/g, ' ').trim() || 'My track'
    const track: Track = {
      id: uid('upload'),
      title,
      artist: 'Uploaded by you',
      vibe: 'your music',
      colors: UPLOAD_COLORS[get().uploads.length % UPLOAD_COLORS.length],
      source: 'upload',
      url: URL.createObjectURL(file),
    }
    set({ uploads: [...get().uploads, track] })
    return track
  },
}))

export const findTrack = (trackId: string | undefined | null, uploads: Track[]) =>
  trackId ? allTracks(uploads).find(t => t.id === trackId) : undefined
