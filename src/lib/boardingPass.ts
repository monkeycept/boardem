import { Flight } from '../types'

const AIRLINES: Record<string, string> = {
  AA: 'American Airlines',
  UA: 'United Airlines',
  DL: 'Delta Air Lines',
  QF: 'Qantas',
  VA: 'Virgin Australia',
  JQ: 'Jetstar',
  BA: 'British Airways',
  NZ: 'Air New Zealand',
  SQ: 'Singapore Airlines',
  EK: 'Emirates',
  QR: 'Qatar Airways',
  CX: 'Cathay Pacific',
  AC: 'Air Canada',
  LH: 'Lufthansa',
  AF: 'Air France',
  KL: 'KLM',
  WN: 'Southwest',
  B6: 'JetBlue',
  AS: 'Alaska Airlines',
  NH: 'ANA',
  JL: 'Japan Airlines',
}

export const airlineName = (code: string) => AIRLINES[code.toUpperCase()] ?? `${code.toUpperCase()} Airlines`

export const normaliseFlightNumber = (raw: string) => {
  const m = raw.toUpperCase().replace(/\s+/g, '').match(/^([A-Z0-9]{2})0*(\d{1,4})[A-Z]?$/)
  if (!m) return null
  return `${m[1]}${m[2]}`
}

const today = () =>
  new Date().toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })

const julianToDate = (julian: number) => {
  if (!julian || julian > 366) return today()
  const d = new Date(new Date().getFullYear(), 0, julian)
  return d.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })
}

const titleCase = (s: string) => s.toLowerCase().replace(/\b\w/g, c => c.toUpperCase())

/**
 * Parse the IATA Bar Coded Boarding Pass (BCBP) format that real boarding
 * passes encode in their PDF417 / Aztec / QR barcode, e.g.
 *   M1DOE/JANE            EABC123 SFOJFKAA 0123 228Y012A0001 100
 */
function parseBcbp(text: string): Flight | null {
  if (!/^M[1-4]/.test(text) || text.length < 58) return null
  const name = text.slice(2, 22).trim()
  const from = text.slice(30, 33).trim()
  const to = text.slice(33, 36).trim()
  const carrier = text.slice(36, 39).trim()
  const flightRaw = text.slice(39, 44).trim()
  const julian = parseInt(text.slice(44, 47), 10)
  const seat = text.slice(48, 52).trim().replace(/^0+/, '')
  const flightNumber = normaliseFlightNumber(`${carrier}${flightRaw}`)
  if (!flightNumber || !/^[A-Z]{3}$/.test(from) || !/^[A-Z]{3}$/.test(to)) return null
  const [last, rawFirst] = name.split('/')
  const first = rawFirst?.replace(/\s+(MR|MRS|MS|MISS|MSTR|DR)\.?$/i, '')
  return {
    flightNumber,
    airline: airlineName(carrier),
    departureAirport: from,
    arrivalAirport: to,
    date: julianToDate(julian),
    seatNumber: seat || '—',
    passengerName: first ? titleCase(`${first.trim()} ${last.trim()}`) : titleCase(name),
  }
}

/** Parses a scanned code. Supports real BCBP passes, JSON, and the simple "AA123-12A" demo format. */
export function parseBoardingPass(text: string): Flight | null {
  const trimmed = text.trim()
  const bcbp = parseBcbp(trimmed)
  if (bcbp) return bcbp

  try {
    const obj = JSON.parse(trimmed) as Record<string, string>
    const flightNumber = normaliseFlightNumber(obj.flight ?? obj.flightNumber ?? '')
    if (flightNumber) {
      return {
        flightNumber,
        airline: airlineName(flightNumber.slice(0, 2)),
        departureAirport: (obj.from ?? '').toUpperCase(),
        arrivalAirport: (obj.to ?? '').toUpperCase(),
        date: today(),
        seatNumber: (obj.seat ?? '').toUpperCase(),
        passengerName: obj.name ?? '',
      }
    }
  } catch {
    /* not JSON */
  }

  const simple = trimmed.toUpperCase().match(/([A-Z0-9]{2}\s?\d{1,4})\s*[-/ ]\s*(\d{1,2}[A-K])/)
  if (simple) {
    const flightNumber = normaliseFlightNumber(simple[1])
    if (flightNumber) {
      return {
        flightNumber,
        airline: airlineName(flightNumber.slice(0, 2)),
        departureAirport: '',
        arrivalAirport: '',
        date: today(),
        seatNumber: simple[2],
        passengerName: '',
      }
    }
  }
  return null
}

export function manualFlight(flightNumber: string, seat: string, from: string, to: string): Flight | null {
  const fn = normaliseFlightNumber(flightNumber)
  if (!fn) return null
  return {
    flightNumber: fn,
    airline: airlineName(fn.slice(0, 2)),
    departureAirport: from.trim().toUpperCase().slice(0, 3),
    arrivalAirport: to.trim().toUpperCase().slice(0, 3),
    date: today(),
    seatNumber: seat.trim().toUpperCase(),
    passengerName: '',
  }
}

export const DEMO_FLIGHT: Flight = {
  flightNumber: 'AA123',
  airline: 'American Airlines',
  departureAirport: 'SFO',
  arrivalAirport: 'JFK',
  date: today(),
  seatNumber: '12A',
  passengerName: '',
}
