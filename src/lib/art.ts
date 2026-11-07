import { useEffect, useState } from 'react'
import { FurnitureType } from '../types'

/**
 * 3D artwork from Microsoft's Fluent Emoji (MIT licence, see src/assets/fluent/LICENSE).
 * Using images instead of system emoji makes every phone show the same art.
 */
const files = import.meta.glob('../assets/fluent/*.webp', { eager: true, import: 'default' }) as Record<string, string>
const art: Record<string, string> = Object.fromEntries(
  Object.entries(files).map(([path, url]) => [path.slice(path.lastIndexOf('/') + 1, -'.webp'.length), url]),
)

export const FURNITURE_ART: Partial<Record<FurnitureType, string>> = {
  bed: art['bed'],
  couch: art['couch-and-lamp'],
  desk: art['desktop-computer'],
  plant: art['potted-plant'],
  lamp: art['light-bulb'],
  speaker: art['speaker-high-volume'],
  tv: art['television'],
  shelf: art['books'],
  painting: art['framed-picture'],
  guitar: art['guitar'],
}

/** Avatars are stored as emoji (so they sync and show in chat); this maps them to artwork. */
const AVATAR_ART: Record<string, string> = {
  '🧑✈': art['pilot'],
  '👨✈': art['man-pilot'],
  '👩💻': art['woman-technologist'],
  '🧑🎤': art['singer'],
  '👩🎤': art['woman-singer'],
  '👨🎨': art['man-artist'],
  '👩🎨': art['woman-artist'],
  '🧑🚀': art['astronaut'],
  '👩🔬': art['woman-scientist'],
  '👨🎓': art['man-student'],
  '🧑🌾': art['farmer'],
  '💃': art['woman-dancing'],
  '🦊': art['fox'],
  '🐼': art['panda'],
  '🐸': art['frog'],
  '🦄': art['unicorn'],
  '🐙': art['octopus'],
  '🤖': art['robot'],
}

// Ignore zero-width joiners and variation selectors so "👩‍💻" and "👩💻" match.
const key = (emoji: string) => emoji.replace(/‍|️/g, '')
const AVATAR_BY_KEY = Object.fromEntries(Object.entries(AVATAR_ART).map(([k, v]) => [key(k), v]))

export const avatarArt = (emoji: string): string | undefined => AVATAR_BY_KEY[key(emoji)]

const cache = new Map<string, HTMLImageElement>()

/** Load an image for drawing on the canvas. Returns undefined until it has loaded. */
export function useCanvasImage(url: string | undefined) {
  const [img, setImg] = useState<HTMLImageElement | undefined>(() => {
    const hit = url ? cache.get(url) : undefined
    return hit?.complete ? hit : undefined
  })
  useEffect(() => {
    if (!url) {
      setImg(undefined)
      return
    }
    const existing = cache.get(url)
    if (existing?.complete) {
      setImg(existing)
      return
    }
    const el = existing ?? new window.Image()
    cache.set(url, el)
    const done = () => setImg(el)
    el.addEventListener('load', done)
    if (!existing) el.src = url
    return () => el.removeEventListener('load', done)
  }, [url])
  return img
}
