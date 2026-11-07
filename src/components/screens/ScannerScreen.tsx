import { useEffect, useRef, useState } from 'react'
import Avatar from '../common/Avatar'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, Keyboard, Plane, ScanLine, Sparkles } from 'lucide-react'
import toast from 'react-hot-toast'
import type { Html5Qrcode } from 'html5-qrcode'
import { Flight } from '../../types'
import { DEMO_FLIGHT, manualFlight, parseBoardingPass } from '../../lib/boardingPass'
import { celebrate } from '../../lib/celebrate'
import { setCabinHum, unlockAudio } from '../../lib/audio'
import { isFirebaseConfigured } from '../../lib/firebase'
import { AVATARS, useUserStore } from '../../stores/userStore'
import { useFlightStore } from '../../stores/flightStore'

type Step = 'start' | 'scan' | 'manual' | 'profile'

function Scanner({ onResult, onCancel }: { onResult: (f: Flight) => void; onCancel: () => void }) {
  const scannerRef = useRef<Html5Qrcode | null>(null)
  const [status, setStatus] = useState('Starting camera…')
  // Keep the latest callbacks without restarting the camera on every render.
  const handlers = useRef({ onResult, onCancel })
  handlers.current = { onResult, onCancel }

  useEffect(() => {
    let cancelled = false
    let done = false
    const run = async () => {
      try {
        const { Html5Qrcode, Html5QrcodeSupportedFormats: F } = await import('html5-qrcode')
        if (cancelled) return
        const scanner = new Html5Qrcode('qr-reader', {
          verbose: false,
          formatsToSupport: [F.QR_CODE, F.PDF_417, F.AZTEC, F.DATA_MATRIX],
        })
        scannerRef.current = scanner
        await scanner.start(
          { facingMode: 'environment' },
          { fps: 10, qrbox: (w, h) => ({ width: Math.floor(w * 0.85), height: Math.floor(h * 0.55) }) },
          text => {
            if (done) return
            const flight = parseBoardingPass(text)
            if (flight) {
              done = true
              handlers.current.onResult(flight)
            } else {
              setStatus('Found a code, but it isn’t a boarding pass. Try the barcode on your pass.')
            }
          },
          () => undefined,
        )
        if (cancelled) {
          await scanner.stop().catch(() => undefined)
          return
        }
        setStatus('Point your camera at the barcode on your boarding pass')
      } catch {
        if (!cancelled) {
          toast.error('Couldn’t open the camera — enter your flight instead')
          handlers.current.onCancel()
        }
      }
    }
    void run()
    return () => {
      cancelled = true
      const s = scannerRef.current
      if (s?.isScanning) void s.stop().then(() => s.clear()).catch(() => undefined)
    }
  }, [])

  return (
    <div className="space-y-3">
      <div className="relative rounded-2xl overflow-hidden bg-black aspect-[4/3] ring-1 ring-sea-400/30">
        <div id="qr-reader" className="w-full h-full [&_video]:object-cover [&_video]:w-full [&_video]:h-full" />
        <div className="pointer-events-none absolute inset-x-6 top-1/2 h-0.5 bg-sea-400/80 shadow-[0_0_12px_2px_rgba(34,211,238,0.7)] animate-pulse" />
      </div>
      <p className="text-sm text-ink-300 text-center">{status}</p>
      <p className="text-xs text-ink-500 text-center">Works with the PDF417 / Aztec / QR barcode printed on paper and mobile passes.</p>
    </div>
  )
}

export default function ScannerScreen() {
  const { name: savedName, avatar: savedAvatar, setProfile, setPage, cabinHum } = useUserStore()
  const board = useFlightStore(s => s.board)
  const [step, setStep] = useState<Step>('start')
  const [flight, setFlight] = useState<Flight | null>(null)
  const [form, setForm] = useState({ flight: '', seat: '', from: '', to: '' })
  const [name, setName] = useState(savedName)
  const [avatar, setAvatar] = useState(savedAvatar)
  const [boarding, setBoarding] = useState(false)

  const gotFlight = (f: Flight) => {
    setFlight(f)
    if (f.passengerName && !savedName) setName(f.passengerName.split(' ')[0])
    setStep('profile')
  }

  const submitManual = (e: React.FormEvent) => {
    e.preventDefault()
    const f = manualFlight(form.flight, form.seat, form.from, form.to)
    if (!f) {
      toast.error('Flight number looks off — try something like QF401')
      return
    }
    gotFlight(f)
  }

  const handleBoard = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!flight) return
    const trimmed = name.trim()
    if (!trimmed) {
      toast.error('Add a name so neighbours know who’s visiting')
      return
    }
    unlockAudio()
    if (cabinHum) setCabinHum(true)
    setBoarding(true)
    setProfile(trimmed.slice(0, 20), avatar)
    await board({ ...flight, passengerName: trimmed })
    setBoarding(false)
    setPage('home')
    celebrate()
    toast.success(`Welcome aboard ${flight.flightNumber}!`, { icon: '✈️' })
  }

  return (
    <div className="w-full h-full overflow-y-auto bg-sky-night">
      <div className="min-h-full max-w-md mx-auto flex flex-col px-5 py-8">
        <motion.header initial={{ y: -16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-jasper-500 to-sea-400 shadow-lg shadow-sea-500/30 mb-4">
            <Plane className="w-8 h-8 text-ink-950" />
          </div>
          <h1 className="text-4xl font-bold text-white tracking-tight">SkyLoft</h1>
          <p className="text-ink-300 mt-2">Turn your flight into a flying neighbourhood.</p>
        </motion.header>

        <div className="flex-1">
          <AnimatePresence mode="wait">
            {step === 'start' && (
              <motion.div key="start" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="space-y-3">
                <button onClick={() => setStep('scan')} className="w-full glass rounded-2xl p-4 flex items-center gap-4 text-left hover:border-sea-400/60 hover:bg-sea-400/5">
                  <ScanLine className="w-8 h-8 text-sea-300 shrink-0" />
                  <span>
                    <span className="block font-semibold text-white">Scan boarding pass</span>
                    <span className="block text-sm text-ink-400">Use your camera on the pass barcode</span>
                  </span>
                </button>
                <button onClick={() => setStep('manual')} className="w-full glass rounded-2xl p-4 flex items-center gap-4 text-left hover:border-sea-400/60 hover:bg-sea-400/5">
                  <Keyboard className="w-8 h-8 text-sea-300 shrink-0" />
                  <span>
                    <span className="block font-semibold text-white">Enter flight details</span>
                    <span className="block text-sm text-ink-400">Type your flight number and seat</span>
                  </span>
                </button>
                <button
                  onClick={() => gotFlight(DEMO_FLIGHT)}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-sea-400 to-jasper-500 text-ink-950 font-bold flex items-center justify-center gap-2 shadow-lg shadow-sea-500/30 active:scale-[0.98] transition-transform"
                >
                  <Sparkles className="w-5 h-5" /> Use Demo Flight
                </button>
                <p className="text-xs text-ink-400 text-center">
                  {isFirebaseConfigured
                    ? 'You’ll meet the real passengers on your flight.'
                    : 'Demo flights come with 8 friendly neighbours to visit.'}
                </p>
              </motion.div>
            )}

            {step === 'scan' && (
              <motion.div key="scan" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="space-y-4">
                <Scanner onResult={gotFlight} onCancel={() => setStep('manual')} />
                <button onClick={() => setStep('start')} className="btn-ghost w-full flex items-center justify-center gap-1">
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
              </motion.div>
            )}

            {step === 'manual' && (
              <motion.form
                key="manual"
                onSubmit={submitManual}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                className="glass rounded-2xl p-4 space-y-3"
              >
                <label className="block">
                  <span className="text-xs text-ink-400">Flight number</span>
                  <input
                    className="input-base mt-1 uppercase"
                    placeholder="QF401"
                    value={form.flight}
                    onChange={e => setForm({ ...form, flight: e.target.value })}
                    autoFocus
                    required
                  />
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <label className="block">
                    <span className="text-xs text-ink-400">Seat</span>
                    <input className="input-base mt-1 uppercase" placeholder="12A" maxLength={4} value={form.seat} onChange={e => setForm({ ...form, seat: e.target.value })} />
                  </label>
                  <label className="block">
                    <span className="text-xs text-ink-400">From</span>
                    <input className="input-base mt-1 uppercase" placeholder="MEL" maxLength={3} value={form.from} onChange={e => setForm({ ...form, from: e.target.value })} />
                  </label>
                  <label className="block">
                    <span className="text-xs text-ink-400">To</span>
                    <input className="input-base mt-1 uppercase" placeholder="SYD" maxLength={3} value={form.to} onChange={e => setForm({ ...form, to: e.target.value })} />
                  </label>
                </div>
                <button type="submit" className="btn-primary w-full py-3">
                  Continue
                </button>
                <button type="button" onClick={() => setStep('start')} className="btn-ghost w-full flex items-center justify-center gap-1">
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
              </motion.form>
            )}

            {step === 'profile' && flight && (
              <motion.form
                key="profile"
                onSubmit={handleBoard}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                className="space-y-4"
              >
                <div className="glass rounded-2xl p-4 flex items-center justify-between">
                  <div>
                    <p className="text-[11px] uppercase tracking-widest text-ink-400">{flight.airline}</p>
                    <p className="text-lg font-bold text-white">
                      {flight.flightNumber}
                      {flight.departureAirport && flight.arrivalAirport && (
                        <span className="text-ink-300 font-medium"> · {flight.departureAirport} → {flight.arrivalAirport}</span>
                      )}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[11px] uppercase text-ink-400">Seat</p>
                    <p className="text-lg font-bold text-sea-300">{flight.seatNumber || '—'}</p>
                  </div>
                </div>

                <div className="glass rounded-2xl p-4 space-y-4">
                  <label className="block">
                    <span className="text-xs text-ink-400">What should neighbours call you?</span>
                    <input className="input-base mt-1" value={name} maxLength={20} onChange={e => setName(e.target.value)} placeholder="Your name" autoFocus />
                  </label>
                  <div>
                    <span className="text-xs text-ink-400">Pick your avatar</span>
                    <div className="grid grid-cols-6 gap-2 mt-2">
                      {AVATARS.map(a => (
                        <button
                          type="button"
                          key={a}
                          onClick={() => setAvatar(a)}
                          aria-label={`Avatar ${a}`}
                          aria-pressed={avatar === a}
                          className={`text-2xl aspect-square rounded-xl flex items-center justify-center transition-all ${
                            avatar === a ? 'bg-sea-400/25 ring-2 ring-sea-400 scale-110' : 'bg-ink-800/70 hover:bg-ink-700'
                          }`}
                        >
                          <Avatar emoji={a} size={34} />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={boarding}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-sea-400 to-jasper-500 text-ink-950 font-bold flex items-center justify-center gap-2 shadow-lg shadow-sea-500/30 disabled:opacity-60"
                >
                  {boarding ? <span className="spinner" /> : <Plane className="w-5 h-5" />} {boarding ? 'Connecting…' : 'Board flight'}
                </button>
                <button type="button" onClick={() => setStep('start')} className="btn-ghost w-full flex items-center justify-center gap-1">
                  <ArrowLeft className="w-4 h-4" /> Change flight
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
