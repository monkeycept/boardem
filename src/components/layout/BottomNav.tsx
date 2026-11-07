import React from 'react'
import { motion } from 'framer-motion'
import { useUserStore } from '../../stores/userStore'
import { Home, Zap, Users, MessageCircle } from 'lucide-react'

export default function BottomNav() {
  const { currentPage, setCurrentPage } = useUserStore()

  const navItems: Array<{ id: 'home' | 'loft' | 'passengers' | 'chat'; label: string; icon: React.ReactNode }> = [
    { id: 'home', label: 'Home', icon: <Home className="w-5 h-5" /> },
    { id: 'loft', label: 'My Loft', icon: <Zap className="w-5 h-5" /> },
    { id: 'passengers', label: 'Passengers', icon: <Users className="w-5 h-5" /> },
    { id: 'chat', label: 'Chat', icon: <MessageCircle className="w-5 h-5" /> },
  ]

  return (
    <div className="glass border-t border-slate-700/50 px-4 py-3 sticky bottom-0 z-20">
      <div className="grid grid-cols-4 gap-2">
        {navItems.map((item) => (
          <motion.button
            key={item.id}
            onClick={() => setCurrentPage(item.id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`flex flex-col items-center gap-1 py-2 px-3 rounded-lg transition-all ${
              currentPage === item.id
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50'
                : 'text-slate-400 hover:text-slate-300 hover:bg-slate-700/30'
            }`}
          >
            {item.icon}
            <span className="text-xs font-medium">{item.label}</span>
          </motion.button>
        ))}
      </div>
    </div>
  )
}
