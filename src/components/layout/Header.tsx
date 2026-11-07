import React from 'react'
import { useUserStore } from '../../stores/userStore'
import { Plane } from 'lucide-react'

export default function Header() {
  const { userName, flightCode } = useUserStore()

  return (
    <div className="glass border-b border-slate-700/50 px-4 py-3 flex items-center justify-between sticky top-0 z-20">
      <div className="flex items-center gap-2">
        <Plane className="w-5 h-5 text-cyan-400" />
        <div>
          <h1 className="text-lg font-bold text-cyan-300">SkyLoft</h1>
          {flightCode && (
            <p className="text-xs text-slate-400">{flightCode}</p>
          )}
        </div>
      </div>

      <div className="text-right">
        {userName && (
          <p className="text-sm font-medium text-slate-100">{userName}</p>
        )}
        <p className="text-xs text-slate-400">✈️ Cruising</p>
      </div>
    </div>
  )
}
