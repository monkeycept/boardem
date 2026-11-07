import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useLoftStore } from '../../stores/loftStore'
import { Palette, Save, Plus, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import LoftCanvas from '../loft/LoftCanvas'
import FurnitureInventory from '../loft/FurnitureInventory'

export default function LoftBuilderScreen() {
  const { furniture, wallpaper, setWallpaper } = useLoftStore()
  const [showInventory, setShowInventory] = useState(false)

  const wallpapers = [
    { id: 'dark-purple', label: 'Dark Purple', color: 'from-purple-900 to-slate-900' },
    { id: 'dark-blue', label: 'Dark Blue', color: 'from-blue-900 to-slate-800' },
    { id: 'dark-neon', label: 'Neon', color: 'from-slate-950 to-purple-950' },
    { id: 'warm-brown', label: 'Warm Brown', color: 'from-amber-900 to-slate-800' },
    { id: 'forest-green', label: 'Forest', color: 'from-green-900 to-slate-900' },
    { id: 'light-gray', label: 'Minimalist', color: 'from-slate-700 to-slate-800' },
    { id: 'pastel-pink', label: 'Pastel', color: 'from-rose-900 to-slate-800' },
    { id: 'ocean-blue', label: 'Ocean', color: 'from-cyan-900 to-slate-900' },
  ]

  const handleSave = () => {
    const loftData = {
      furniture,
      wallpaper,
      savedAt: new Date().toLocaleTimeString()
    }
    localStorage.setItem('loft', JSON.stringify(loftData))
    toast.success('Loft saved! 💾', { icon: '✨' })
  }

  return (
    <div className="w-full h-full flex flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Top Controls */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass border-b border-slate-700/50 p-4 flex items-center justify-between"
      >
        <div>
          <h2 className="font-bold text-cyan-300">My Loft</h2>
          <p className="text-xs text-slate-400">{furniture.length} items</p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setShowInventory(!showInventory)}
            className="btn-secondary flex items-center gap-1"
          >
            <Plus className="w-4 h-4" />
            Add
          </button>
          <button
            onClick={handleSave}
            className="btn-primary flex items-center gap-1"
          >
            <Save className="w-4 h-4" />
            Save
          </button>
        </div>
      </motion.div>

      {/* Wallpaper Selector */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="glass border-b border-slate-700/50 p-4"
      >
        <div className="flex items-center gap-2 mb-3">
          <Palette className="w-4 h-4 text-cyan-400" />
          <span className="text-sm font-medium text-slate-300">Wallpaper</span>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {wallpapers.map(wp => (
            <button
              key={wp.id}
              onClick={() => setWallpaper(wp.id)}
              className={`h-8 rounded-lg transition-all border-2 ${
                wallpaper === wp.id
                  ? 'border-cyan-400 ring-2 ring-cyan-500/50'
                  : 'border-slate-600 hover:border-cyan-400/50'
              } bg-gradient-to-br ${wp.color}`}
              title={wp.label}
            />
          ))}
        </div>
      </motion.div>

      {/* Canvas */}
      <div className="flex-1 overflow-hidden">
        <LoftCanvas wallpaper={wallpaper} />
      </div>

      {/* Inventory Sidebar */}
      {showInventory && (
        <motion.div
          initial={{ x: 300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 300, opacity: 0 }}
          className="absolute right-0 top-0 bottom-0 w-80 glass-dark border-l border-slate-700/50 overflow-y-auto z-40 shadow-2xl shadow-black/50"
        >
          <div className="p-4">
            <button
              onClick={() => setShowInventory(false)}
              className="ml-auto block text-slate-400 hover:text-slate-200"
            >
              ✕
            </button>
          </div>
          <FurnitureInventory />
        </motion.div>
      )}
    </div>
  )
}
