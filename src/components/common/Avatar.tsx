import { avatarArt } from '../../lib/art'

/** Shows a passenger's avatar as 3D artwork, falling back to the emoji itself. */
export default function Avatar({ emoji, size = 40, className = '' }: { emoji: string; size?: number; className?: string }) {
  const src = avatarArt(emoji)
  if (src) {
    return <img src={src} alt="" width={size} height={size} draggable={false} className={`inline-block select-none ${className}`} style={{ width: size, height: size }} />
  }
  return (
    <span className={`inline-flex items-center justify-center leading-none ${className}`} style={{ width: size, height: size, fontSize: size * 0.85 }} aria-hidden>
      {emoji}
    </span>
  )
}
