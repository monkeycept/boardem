import type { Config } from 'tailwindcss'
import defaultTheme from 'tailwindcss/defaultTheme'
import { ramps } from './src/theme/palette'

/**
 * Colours come only from Sanzo Wada's combination 155 and two companions
 * (see scripts/make_palette.py):
 *   ink    — Deep Indigo neutrals (surfaces, text)
 *   sea    — Benzol Green (primary accent)
 *   jasper — Jasper Red (warm accent, alerts)
 *   jade   — Cobalt Green (online / success)
 *   ocher  — Yellow Ocher (demo / warning)
 */
const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      white: '#ffffff',
      black: '#000000',
      ...ramps,
    },
    extend: {
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
      },
      animation: {
        float: 'float 3s ease-in-out infinite',
        'spin-slow': 'spin 3s linear infinite',
        eq: 'eq 0.9s ease-in-out infinite',
        shake: 'shake 0.9s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-3px)' },
        },
        eq: {
          '0%, 100%': { height: '25%' },
          '50%': { height: '100%' },
        },
        shake: {
          '0%, 100%': { transform: 'translate(0, 0) rotate(0)' },
          '10%': { transform: 'translate(-6px, 3px) rotate(-0.6deg)' },
          '25%': { transform: 'translate(5px, -4px) rotate(0.5deg)' },
          '40%': { transform: 'translate(-4px, 2px) rotate(-0.3deg)' },
          '60%': { transform: 'translate(3px, -1px) rotate(0.2deg)' },
          '80%': { transform: 'translate(-1px, 1px)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
