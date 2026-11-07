import React from 'react'
import { motion } from 'framer-motion'
import { useFlightStore } from '../../stores/flightStore'
import { Users, Circle } from 'lucide-react'

export default function PassengersScreen() {
  const { passengers, setVisitingLoftId } = useFlightStore()
  const onlineCount = passengers.filter(p => p.status === 'online').length

  return (
    <div className="w-full h-full flex flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass border-b border-slate-700/50 p-4"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-cyan-400" />
            <div>
              <h2 className="font-bold text-cyan-300">Flight Passengers</h2>
              <p className="text-xs text-slate-400">{onlineCount} online</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Passenger Grid */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-2 gap-3">
          {passengers.map((passenger, idx) => (
            <motion.button
              key={passenger.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              onClick={() => setVisitingLoftId(passenger.loftId)}
              className="glass rounded-xl p-4 text-center hover:border-cyan-500/50 hover:bg-cyan-500/10 transition-all group"
            >
              {/* Avatar */}
              <div className="text-5xl mb-2 group-hover:scale-110 transition-transform">
                {passenger.avatar}
              </div>

              {/* Name */}
              <h3 className="font-bold text-slate-100 mb-1">{passenger.name}</h3>

              {/* Status */}
              <div className="flex items-center justify-center gap-1 text-xs mb-3">
                <Circle
                  className={`w-2 h-2 ${passenger.status === 'online' ? 'fill-green-400 text-green-400' : 'fill-slate-500 text-slate-500'}`}
                />
                <span className={passenger.status === 'online' ? 'text-green-400' : 'text-slate-400'}>
                  {passenger.status === 'online' ? 'Online' : 'Offline'}
                </span>
              </div>

              {/* Visit button */}
              <div className="text-xs font-medium text-cyan-300 opacity-0 group-hover:opacity-100 transition-opacity">
                Visit Loft →
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  )
}
