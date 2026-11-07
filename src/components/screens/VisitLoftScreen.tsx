import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useFlightStore } from '../../stores/flightStore'
import { useUserStore } from '../../stores/userStore'
import { ArrowLeft, Volume2, MessageCircle } from 'lucide-react'

export default function VisitLoftScreen() {
  const { visitingLoftId, lofts, setVisitingLoftId } = useFlightStore()
  const { setCurrentPage } = useUserStore()
  const [showChat, setShowChat] = useState(false)
  const [chatText, setChatText] = useState('')

  if (!visitingLoftId || !lofts[visitingLoftId]) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <p className="text-slate-400">Loft not found</p>
      </div>
    )
  }

  const loft = lofts[visitingLoftId]

  const handleExit = () => {
    setVisitingLoftId(null)
    setCurrentPage('passengers')
  }

  return (
    <div className="w-full h-full flex flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass border-b border-slate-700/50 p-4 flex items-center justify-between"
      >
        <div className="flex items-center gap-2">
          <button
            onClick={handleExit}
            className="btn-ghost flex items-center gap-1"
          >
            <ArrowLeft className="w-4 h-4" />
            Exit
          </button>
        </div>

        <div className="text-center">
          <p className="text-lg font-bold text-cyan-300">{loft.ownerName}'s Loft</p>
          <p className="text-xs text-slate-400">Visitor Mode</p>
        </div>

        <button
          onClick={() => setShowChat(!showChat)}
          className="btn-secondary flex items-center gap-1"
        >
          <MessageCircle className="w-4 h-4" />
          Chat
        </button>
      </motion.div>

      {/* Room view */}
      <div className="flex-1 relative overflow-hidden">
        <div className="w-full h-full flex items-center justify-center">
          {/* Background matching the loft's wallpaper */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/40 to-slate-900/40" />

          {/* Furniture preview */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-4"
          >
            <h3 className="text-2xl font-bold text-cyan-300 mb-4">
              {loft.ownerName}'s Room
            </h3>

            {/* Furniture items display */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              {loft.furniture.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1 }}
                  className="glass rounded-lg p-4 text-4xl hover:scale-105 transition-transform"
                >
                  {item.type === 'bed' && '🛏️'}
                  {item.type === 'couch' && '🛋️'}
                  {item.type === 'desk' && '🪑'}
                  {item.type === 'plant' && '🪴'}
                  {item.type === 'lamp' && '💡'}
                  {item.type === 'rug' && '📦'}
                  {item.type === 'speaker' && '🔊'}
                  {item.type === 'tv' && '📺'}
                  {item.type === 'poster' && '🖼️'}
                  {item.type === 'shelf' && '📚'}
                  {item.type === 'painting' && '🎨'}
                  {item.type === 'guitar' && '🎸'}
                </motion.div>
              ))}
            </div>

            {/* Now Playing */}
            {loft.currentlyPlaying && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="glass rounded-lg p-4 max-w-xs mx-auto"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Volume2 className="w-4 h-4 text-cyan-400 animate-pulse" />
                  <span className="text-sm text-slate-400">Now Playing</span>
                </div>
                <p className="font-bold text-cyan-300">{loft.currentlyPlaying.title}</p>
                <p className="text-sm text-slate-400">{loft.currentlyPlaying.artist}</p>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Chat panel */}
      {showChat && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="glass border-t border-slate-700/50 p-4 space-y-3"
        >
          <div className="flex gap-2">
            <input
              type="text"
              placeholder={`Chat with ${loft.ownerName}...`}
              value={chatText}
              onChange={(e) => setChatText(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  setChatText('')
                }
              }}
              className="input-base flex-1"
            />
            <button className="btn-primary">Send</button>
          </div>
        </motion.div>
      )}
    </div>
  )
}
