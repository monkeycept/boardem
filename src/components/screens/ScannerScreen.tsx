import React, { useEffect, useRef, useState } from 'react'
import { Html5QrcodeScanner } from 'html5-qrcode'
import { motion } from 'framer-motion'
import { useUserStore } from '../../stores/userStore'
import { useFlightStore } from '../../stores/flightStore'
import { Plane, Camera, Zap } from 'lucide-react'
import { demoFlight, demosPassengers, demoLofts } from '../../lib/demo-data'
import toast from 'react-hot-toast'

export default function ScannerScreen() {
  const { setUserName, setFlightCode, setCurrentPage } = useUserStore()
  const { setCurrentFlight, initializeDemoData } = useFlightStore()
  const [scanning, setScanning] = useState(true)
  const [scanned, setScanned] = useState(false)
  const scannerRef = useRef<Html5QrcodeScanner | null>(null)

  useEffect(() => {
    if (!scanning || scanned) return

    const scanner = new Html5QrcodeScanner(
      'qr-reader',
      {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1,
        showTorchButtonIfSupported: true,
      },
      false
    )

    const onSuccess = (decodedText: string) => {
      const match = decodedText.match(/([A-Z]{2}\d{3,4})-(\d{1,2}[A-Z])/)

      if (match) {
        const flightNumber = match[1]
        const seatNumber = match[2]

        handleBoardingPass(flightNumber, seatNumber)
        setScanned(true)
        scanner.clear()
      }
    }

    const onError = () => {
      // Silent error
    }

    scanner.render(onSuccess, onError)
    scannerRef.current = scanner

    return () => {
      try {
        scanner.clear()
      } catch (e) {
        // Ignore cleanup errors
      }
    }
  }, [scanning, scanned])

  const handleBoardingPass = (flightNumber: string, seatNumber: string) => {
    setUserName('Passenger')
    setFlightCode(flightNumber)
    setCurrentFlight({
      flightNumber,
      seatNumber,
      departureAirport: 'SFO',
      arrivalAirport: 'JFK',
      departureTime: '09:00 AM',
      arrivalTime: '05:30 PM',
      date: new Date().toLocaleDateString(),
      passengerName: 'You',
      airline: 'American Airlines'
    })

    initializeDemoData()

    toast.success(`Welcome aboard ${flightNumber}!`, {
      duration: 2000,
      icon: '✈️'
    })

    setTimeout(() => {
      setCurrentPage('home')
    }, 1000)
  }

  const handleDemoMode = () => {
    setUserName(demoFlight.passengerName)
    setFlightCode(demoFlight.flightNumber)
    setCurrentFlight(demoFlight)
    initializeDemoData()

    toast.success(`Welcome aboard ${demoFlight.flightNumber}!`, {
      duration: 2000,
      icon: '✈️'
    })

    setTimeout(() => {
      setCurrentPage('home')
    }, 1000)
  }

  return (
    <div className="w-full h-full flex flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
      {/* Header */}
      <div className="p-6 text-center">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="flex items-center justify-center gap-3 mb-4"
        >
          <Plane className="w-8 h-8 text-cyan-400" />
          <h1 className="text-4xl font-bold text-cyan-300">SkyLoft</h1>
        </motion.div>

        <motion.p
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-slate-300 text-lg"
        >
          Your flying neighborhood awaits
        </motion.p>
      </div>

      {/* Scanner or Demo */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 gap-6">
        {scanning && !scanned ? (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="w-full max-w-sm"
          >
            <div className="glass rounded-2xl p-6 overflow-hidden">
              <div
                id="qr-reader"
                className="w-full"
                style={{ minHeight: '300px' }}
              />
              <div className="mt-4 text-center text-slate-400 text-sm">
                Point camera at boarding pass QR code
              </div>
            </div>
          </motion.div>
        ) : null}

        {/* Scanning indicator */}
        {scanning && !scanned && (
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex items-center gap-2 text-cyan-400"
          >
            <Camera className="w-5 h-5" />
            <span>Scanning...</span>
          </motion.div>
        )}
      </div>

      {/* Demo Mode Button */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="p-6 space-y-3"
      >
        <button
          onClick={handleDemoMode}
          className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-900 font-bold rounded-xl hover:shadow-lg hover:shadow-cyan-500/50 transition-all active:scale-95 flex items-center justify-center gap-2"
        >
          <Zap className="w-5 h-5" />
          Use Demo Flight
        </button>

        <p className="text-xs text-slate-400 text-center">
          Can't scan? Try demo mode to explore with 8 real passengers
        </p>
      </motion.div>
    </div>
  )
}
