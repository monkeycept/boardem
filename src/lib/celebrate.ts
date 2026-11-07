import confetti from 'canvas-confetti'
import { wada } from '../theme/wada'

// Confetti in the app's Wada combination (155) plus two warm companions.
const COLORS = [wada.benzolGreen, wada.jasperRed, wada.orangeYellow, wada.paleKingsBlue, '#f3f7fe']

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
