import { Track } from '../../types'

export default function AlbumThumb({ track, size = 44, spinning = false }: { track?: Track; size?: number; spinning?: boolean }) {
  const [a, b] = track?.colors ?? ['#475569', '#94a3b8']
  return (
    <div
      className="relative shrink-0 rounded-md overflow-hidden ring-1 ring-white/20"
      style={{ width: size, height: size, background: `linear-gradient(135deg, ${a}, ${b})` }}
      aria-hidden
    >
      <div
        className={`absolute rounded-full bg-slate-950/85 ${spinning ? 'animate-spin-slow' : ''}`}
        style={{ width: size * 0.5, height: size * 0.5, right: size * 0.12, top: size * 0.18 }}
      >
        <div className="absolute inset-0 m-auto rounded-full" style={{ width: size * 0.14, height: size * 0.14, background: b }} />
      </div>
    </div>
  )
}
