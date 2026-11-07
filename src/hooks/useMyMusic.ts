import { useCallback } from 'react'
import { findTrack, useAudioStore } from '../stores/audioStore'
import { useLoftStore } from '../stores/loftStore'

/** Playing music in your own loft also sets what visitors hear. */
export function useMyMusic() {
  const setNowPlaying = useLoftStore(s => s.setNowPlaying)

  return useCallback(
    (trackId: string) => {
      const audio = useAudioStore.getState()
      if (audio.playing && audio.currentTrackId === trackId) {
        audio.stop()
        setNowPlaying(null)
        return
      }
      const track = findTrack(trackId, audio.uploads)
      if (!track) return
      audio.play(trackId)
      setNowPlaying({ trackId: track.id, title: track.title, artist: track.artist })
    },
    [setNowPlaying],
  )
}
