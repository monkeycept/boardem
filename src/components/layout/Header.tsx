import { Plane, Wind } from 'lucide-react'
import { useUserStore } from '../../stores/userStore'
import { useFlightStore } from '../../stores/flightStore'
import { setCabinHum } from '../../lib/audio'

export default function Header() {
  const { cabinHum, setCabinHum: saveHum } = useUserStore()
  const { flight, mode, connecting } = useFlightStore()

  const toggleHum = () => {
    setCabinHum(!cabinHum)
    saveHum(!cabinHum)
  }

  return (
    <header className="glass border-x-0 border-t-0 px-4 py-2.5 flex items-center justify-between gap-3 pt-safe">
      <div className="flex items-center gap-2 min-w-0">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-jasper-500 to-sea-400 flex items-center justify-center shrink-0">
          <Plane className="w-4 h-4 text-ink-950" />
        </div>
        <div className="min-w-0">
          <h1 className="text-base font-bold text-white leading-tight">SkyLoft</h1>
          {flight && (
            <p className="text-[11px] text-ink-400 truncate">
              {flight.flightNumber}
              {flight.departureAirport && flight.arrivalAirport ? ` · ${flight.departureAirport} → ${flight.arrivalAirport}` : ''}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span
          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full ${
            connecting ? 'bg-ink-700 text-ink-300' : mode === 'live' ? 'bg-jade-400/15 text-jade-300' : 'bg-ocher-400/15 text-ocher-200'
          }`}
          title={mode === 'live' ? 'Synced with passengers on your flight' : 'Demo neighbours — runs entirely on this device'}
        >
          {connecting ? 'Connecting' : mode === 'live' ? '● Live' : 'Demo'}
        </span>
        <button
          onClick={toggleHum}
          className={`p-2 rounded-lg transition-colors ${cabinHum ? 'text-sea-300 bg-sea-400/10' : 'text-ink-500 hover:text-ink-300'}`}
          aria-pressed={cabinHum}
          aria-label={cabinHum ? 'Turn cabin hum off' : 'Turn cabin hum on'}
          title="Cabin hum"
        >
          <Wind className="w-4 h-4" />
        </button>
      </div>
    </header>
  )
}
