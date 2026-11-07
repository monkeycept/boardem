import type { Config } from 'tailwindcss'
import defaultTheme from 'tailwindcss/defaultTheme'

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
      },
      animation: {
        float: 'float 3s ease-in-out infinite',
        'spin-slow': 'spin 3s linear infinite',
        eq: 'eq 0.9s ease-in-out infinite',
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
      },
    },
  },
  plugins: [],
}

export default config
