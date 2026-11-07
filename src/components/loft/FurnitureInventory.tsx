import React from 'react'
import { motion } from 'framer-motion'
import { useLoftStore } from '../../stores/loftStore'

const FURNITURE_ITEMS = [
  { id: 'bed', label: 'Bed', emoji: '🛏️' },
  { id: 'couch', label: 'Couch', emoji: '🛋️' },
  { id: 'desk', label: 'Desk', emoji: '🪑' },
  { id: 'plant', label: 'Plant', emoji: '🪴' },
  { id: 'lamp', label: 'Lamp', emoji: '💡' },
  { id: 'rug', label: 'Rug', emoji: '📦' },
  { id: 'speaker', label: 'Speaker', emoji: '🔊' },
  { id: 'tv', label: 'TV', emoji: '📺' },
  { id: 'poster', label: 'Poster', emoji: '🖼️' },
  { id: 'shelf', label: 'Shelf', emoji: '📚' },
  { id: 'painting', label: 'Painting', emoji: '🎨' },
  { id: 'guitar', label: 'Guitar', emoji: '🎸' },
]

export default function FurnitureInventory() {
  const { addFurniture } = useLoftStore()

  const handleAddFurniture = (type: string) => {
    const newItem = {
      id: `furniture-${Date.now()}`,
      type: type as any,
      x: Math.random() * 300 + 50,
      y: Math.random() * 300 + 50,
      rotation: 0,
      scale: 1,
      zIndex: Math.floor(Math.random() * 100),
    }
    addFurniture(newItem)
  }

  return (
    <div className="p-4 space-y-2">
      <h3 className="font-bold text-cyan-300 text-sm mb-4">Furniture</h3>
      <div className="grid grid-cols-2 gap-2">
        {FURNITURE_ITEMS.map((item, idx) => (
          <motion.button
            key={item.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            onClick={() => handleAddFurniture(item.id)}
            className="glass rounded-lg p-3 text-center hover:border-cyan-500/50 hover:bg-cyan-500/10 transition-all"
          >
            <div className="text-3xl mb-1">{item.emoji}</div>
            <div className="text-xs text-slate-300 font-medium">{item.label}</div>
          </motion.button>
        ))}
      </div>

      <div className="pt-4 text-xs text-slate-400 text-center">
        <p>Click to add • Drag to place • Right-click to rotate</p>
      </div>
    </div>
  )
}
