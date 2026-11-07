import confetti from 'canvas-confetti'

const COLORS = ['#22d3ee', '#a855f7', '#f472b6', '#facc15', '#ffffff']

export function celebrate(intensity: 'big' | 'small' = 'big') {
  const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  if (reduced) return
  if (intensity === 'small') {
    void confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 }, colors: COLORS, scalar: 0.8 })
    return
  }
  void confetti({ particleCount: 90, spread: 75, origin: { x: 0.3, y: 0.35 }, colors: COLORS })
  window.setTimeout(() => void confetti({ particleCount: 90, spread: 75, origin: { x: 0.7, y: 0.35 }, colors: COLORS }), 180)
}
