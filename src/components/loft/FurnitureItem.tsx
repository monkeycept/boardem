import React, { useRef, useState } from 'react'
import { Group, Text, Circle, Rect } from 'react-konva'
import Konva from 'konva'
import { FurnitureItem } from '../../types'

interface FurnitureItemProps {
  item: FurnitureItem
  isSelected: boolean
  onSelect: () => void
  onDragEnd: (pos: { x: number; y: number }) => void
  onRotate: (rotation: number) => void
  onDelete: () => void
}

const FURNITURE_EMOJIS: Record<string, string> = {
  'bed': '🛏️',
  'couch': '🛋️',
  'desk': '🪑',
  'plant': '🪴',
  'lamp': '💡',
  'rug': '📦',
  'speaker': '🔊',
  'tv': '📺',
  'poster': '🖼️',
  'shelf': '📚',
  'painting': '🎨',
  'guitar': '🎸',
}

export default function FurnitureItem({
  item,
  isSelected,
  onSelect,
  onDragEnd,
  onRotate,
  onDelete,
}: FurnitureItemProps) {
  const groupRef = useRef<Konva.Group>(null)
  const [isRotating, setIsRotating] = useState(false)

  const emoji = FURNITURE_EMOJIS[item.type] || '📦'
  const size = 50

  const handleDragEnd = (e: any) => {
    onDragEnd({ x: e.target.x(), y: e.target.y() })
  }

  const handleDoubleClick = () => {
    onDelete()
  }

  const handleContextMenu = (e: any) => {
    e.evt.preventDefault()
    setIsRotating(!isRotating)
    if (isRotating) {
      const rotation = (item.rotation + 45) % 360
      onRotate(rotation)
    }
  }

  return (
    <Group
      ref={groupRef}
      x={item.x}
      y={item.y}
      rotation={item.rotation}
      draggable
      onDragEnd={handleDragEnd}
      onClick={onSelect}
      onDoubleClick={handleDoubleClick}
      onContextMenu={handleContextMenu}
      zIndex={item.zIndex}
    >
      {/* Furniture background */}
      <Rect
        x={-size / 2}
        y={-size / 2}
        width={size}
        height={size}
        fill="rgba(34, 211, 238, 0.2)"
        stroke={isSelected ? '#22d3ee' : 'rgba(34, 211, 238, 0.5)'}
        strokeWidth={isSelected ? 2 : 1}
        cornerRadius={8}
      />

      {/* Emoji */}
      <Text
        x={-20}
        y={-15}
        text={emoji}
        fontSize={40}
        align="center"
      />

      {/* Selection indicator */}
      {isSelected && (
        <>
          <Circle
            x={-size / 2 - 4}
            y={-size / 2 - 4}
            radius={4}
            fill="#22d3ee"
          />
          <Text
            x={-size / 2 - 15}
            y={size / 2 + 8}
            text="Drag"
            fontSize={10}
            fill="#22d3ee"
            align="center"
          />
          <Text
            x={size / 2 - 30}
            y={size / 2 + 8}
            text="R: Rotate"
            fontSize={10}
            fill="#22d3ee"
            align="center"
          />
        </>
      )}
    </Group>
  )
}
