import React, { useRef } from 'react'
import { Stage, Layer, Rect, Group, Text, Image as KonvaImage } from 'react-konva'
import { useLoftStore } from '../../stores/loftStore'
import FurnitureItemComponent from './FurnitureItem'
import Konva from 'konva'

interface LoftCanvasProps {
  wallpaper: string
}

const WALLPAPER_COLORS: Record<string, { bg: string; accent: string }> = {
  'dark-purple': { bg: '#6d28d9', accent: '#a78bfa' },
  'dark-blue': { bg: '#1e3a8a', accent: '#60a5fa' },
  'dark-neon': { bg: '#0a0f1f', accent: '#22d3ee' },
  'warm-brown': { bg: '#5d3a1a', accent: '#d97706' },
  'forest-green': { bg: '#134e4a', accent: '#10b981' },
  'light-gray': { bg: '#2d3748', accent: '#cbd5e1' },
  'pastel-pink': { bg: '#831843', accent: '#f472b6' },
  'ocean-blue': { bg: '#0c4a6e', accent: '#06b6d4' },
}

export default function LoftCanvas({ wallpaper }: LoftCanvasProps) {
  const { furniture, selectedItemId, selectItem, updateFurniture, removeFurniture } = useLoftStore()
  const stageRef = useRef<Konva.Stage>(null)
  const colors = WALLPAPER_COLORS[wallpaper] || WALLPAPER_COLORS['dark-purple']

  const handleStageClick = (e: any) => {
    if (e.target === e.target.getStage()) {
      selectItem(null)
    }
  }

  const handleItemDragEnd = (id: string, newPos: { x: number; y: number }) => {
    updateFurniture(id, { x: newPos.x, y: newPos.y })
  }

  const handleItemRotate = (id: string, rotation: number) => {
    updateFurniture(id, { rotation })
  }

  const stageWidth = typeof window !== 'undefined' ? window.innerWidth : 500
  const stageHeight = typeof window !== 'undefined' ? window.innerHeight - 200 : 500

  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 relative overflow-hidden">
      <Stage
        ref={stageRef}
        width={stageWidth}
        height={stageHeight}
        onClick={handleStageClick}
      >
        <Layer>
          {/* Background */}
          <Rect
            x={0}
            y={0}
            width={stageWidth}
            height={stageHeight}
            fill={colors.bg}
          />

          {/* Grid pattern (subtle) */}
          <Group opacity={0.05}>
            {Array.from({ length: 20 }).map((_, i) => (
              <Group key={i}>
                <Rect
                  x={i * 40}
                  y={0}
                  width={1}
                  height={stageHeight}
                  fill={colors.accent}
                />
                <Rect
                  x={0}
                  y={i * 40}
                  width={stageWidth}
                  height={1}
                  fill={colors.accent}
                />
              </Group>
            ))}
          </Group>

          {/* Furniture items */}
          {furniture.map(item => (
            <FurnitureItemComponent
              key={item.id}
              item={item}
              isSelected={selectedItemId === item.id}
              onSelect={() => selectItem(item.id)}
              onDragEnd={(pos) => handleItemDragEnd(item.id, pos)}
              onRotate={(rot) => handleItemRotate(item.id, rot)}
              onDelete={() => removeFurniture(item.id)}
            />
          ))}

          {/* Empty state */}
          {furniture.length === 0 && (
            <Text
              x={stageWidth / 2 - 150}
              y={stageHeight / 2 - 50}
              text="Tap + Add to start decorating"
              fontSize={24}
              fontFamily="Inter"
              fill={colors.accent}
              opacity={0.3}
              align="center"
              width={300}
            />
          )}
        </Layer>
      </Stage>

      {/* Keyboard controls hint */}
      <div className="absolute bottom-4 left-4 text-xs text-slate-400 pointer-events-none">
        <p>• Drag to move • Right-click to rotate • Double-click to delete</p>
      </div>
    </div>
  )
}
