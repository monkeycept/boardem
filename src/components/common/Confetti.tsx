import React, { useEffect } from 'react'
import confetti from 'canvas-confetti'

export default function Confetti() {
  useEffect(() => {
    // Trigger confetti on first render (boarding)
    const timer = setTimeout(() => {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.3 },
        colors: ['#22d3ee', '#06b6d4', '#0891b2', '#0e7490'],
      })
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  return null
}
