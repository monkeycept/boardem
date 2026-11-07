import React from 'react'
import { motion } from 'framer-motion'
import { useUserStore } from '../../stores/userStore'
import { useFlightStore } from '../../stores/flightStore'
import { Users, Music, Zap, MessageSquare } from 'lucide-react'

export default function HomeScreen() {
  const { userName } = useUserStore()
  const { passengers } = useFlightStore()
  const onlineCount = passengers.filter(p => p.status === 'online').length

  const features = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'Design Your Loft',
      desc: 'Drag furniture, hang posters, set the vibe'
    },
    {
      icon: <Music className="w-6 h-6" />,
      title: 'Share Your Music',
      desc: 'Play your favorite tracks for visitors'
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: 'Visit Others',
      desc: 'Check out 8 unique passenger lofts'
    },
    {
      icon: <MessageSquare className="w-6 h-6" />,
      title: 'Chat & Vibe',
      desc: 'Float chat bubbles across lofts'
    },
  ]

  return (
    <div className="w-full h-full flex flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="p-6 text-center"
      >
        <h2 className="text-3xl font-bold text-cyan-300 mb-2">
          Welcome, {userName}! ✈️
        </h2>
        <p className="text-slate-300 text-lg mb-6">
          {onlineCount} passengers online on your flight
        </p>

        {/* Status cards */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="glass rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-cyan-400">{onlineCount}</div>
            <div className="text-xs text-slate-400">Online</div>
          </div>
          <div className="glass rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-cyan-400">8</div>
            <div className="text-xs text-slate-400">Lofts</div>
          </div>
          <div className="glass rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-cyan-400">🎵</div>
            <div className="text-xs text-slate-400">Vibing</div>
          </div>
        </div>
      </motion.div>

      {/* Features Grid */}
      <div className="flex-1 px-4 pb-4 overflow-y-auto">
        <div className="grid grid-cols-2 gap-3">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="glass rounded-xl p-4 text-center hover:border-cyan-500/50 transition-colors"
            >
              <div className="flex justify-center mb-2 text-cyan-400">
                {feature.icon}
              </div>
              <h3 className="font-bold text-slate-100 text-sm mb-1">
                {feature.title}
              </h3>
              <p className="text-xs text-slate-400">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-6 space-y-3"
        >
          <p className="text-slate-400 text-xs text-center mb-3">
            Pick a tab below to get started
          </p>
        </motion.div>
      </div>
    </div>
  )
}
