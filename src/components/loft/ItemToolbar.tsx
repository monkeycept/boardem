import { motion } from 'framer-motion'
import { ArrowUpToLine, Minus, Pause, Play, Plus, RotateCw, Trash2 } from 'lucide-react'
import { FurnitureItem } from '../../types'
import { getCatalogItem } from '../../lib/room'

interface Props {
  item: FurnitureItem
  trackTitle?: string
  isPlaying: boolean
  onRotate: () => void
  onResize: (delta: number) => void
  onForward: () => void
  onDelete: () => void
  onTogglePlay: () => void
}

const Btn = ({ label, onClick, children, danger }: { label: string; onClick: () => void; children: React.ReactNode; danger?: boolean }) => (
  <button
    onClick={onClick}
    aria-label={label}
    title={label}
    className={`flex flex-col items-center gap-0.5 px-2.5 py-1.5 rounded-xl text-[10px] font-medium transition-colors ${
      danger ? 'text-rose-300 hover:bg-rose-500/20' : 'text-slate-200 hover:bg-slate-700/70'
    }`}
  >
    {children}
    <span>{label}</span>
  </button>
)

export default function ItemToolbar({ item, trackTitle, isPlaying, onRotate, onResize, onForward, onDelete, onTogglePlay }: Props) {
  const cat = getCatalogItem(item.type)
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 20, opacity: 0 }}
      className="absolute bottom-1 inset-x-0 mx-auto w-fit max-w-[calc(100%-1rem)] glass-dark rounded-2xl px-2 py-1.5 flex items-center gap-0.5 z-20 shadow-xl shadow-black/50"
    >
      <span className="hidden sm:block text-xs text-slate-400 px-2 max-w-[8rem] truncate">{item.type === 'album' ? trackTitle : cat.label}</span>
      {item.type === 'album' && (
        <Btn label={isPlaying ? 'Pause' : 'Play'} onClick={onTogglePlay}>
          {isPlaying ? <Pause className="w-4 h-4 text-cyan-300" /> : <Play className="w-4 h-4 text-cyan-300" />}
        </Btn>
      )}
      <Btn label="Rotate" onClick={onRotate}>
        <RotateCw className="w-4 h-4" />
      </Btn>
      <Btn label="Smaller" onClick={() => onResize(-0.15)}>
        <Minus className="w-4 h-4" />
      </Btn>
      <Btn label="Bigger" onClick={() => onResize(0.15)}>
        <Plus className="w-4 h-4" />
      </Btn>
      <Btn label="To front" onClick={onForward}>
        <ArrowUpToLine className="w-4 h-4" />
      </Btn>
      <Btn label="Remove" onClick={onDelete} danger>
        <Trash2 className="w-4 h-4" />
      </Btn>
    </motion.div>
  )
}
