import { useEffect, useRef } from 'react'
import { Circle, Ellipse, Group, Rect, Star, Text } from 'react-konva'
import Konva from 'konva'
import { FurnitureItem, Track } from '../../types'
import { ALBUM_SIZE, getCatalogItem, ROOM_H, ROOM_W } from '../../lib/room'

export const EMOJI_FONT = '"Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif'

interface Props {
  item: FurnitureItem
  track?: Track
  editable: boolean
  selected: boolean
  isPlaying: boolean
  musicOn: boolean
  stageScale: number
  onSelect?: (id: string) => void
  onMove?: (id: string, x: number, y: number) => void
  onActivate?: (item: FurnitureItem) => void
}

const shade = (hex: string, amount: number) => {
  const n = parseInt(hex.replace('#', ''), 16)
  const r = Math.min(255, Math.max(0, (n >> 16) + amount))
  const g = Math.min(255, Math.max(0, ((n >> 8) & 0xff) + amount))
  const b = Math.min(255, Math.max(0, (n & 0xff) + amount))
  return `rgb(${r},${g},${b})`
}

function AlbumArt({ track, playing }: { track?: Track; playing: boolean }) {
  const s = ALBUM_SIZE
  const [a, b] = track?.colors ?? ['#475569', '#94a3b8']
  return (
    <Group>
      <Rect
        x={-s / 2}
        y={-s / 2}
        width={s}
        height={s}
        cornerRadius={3}
        fillLinearGradientStartPoint={{ x: -s / 2, y: -s / 2 }}
        fillLinearGradientEndPoint={{ x: s / 2, y: s / 2 }}
        fillLinearGradientColorStops={[0, a, 1, b]}
        stroke="#f8fafc"
        strokeWidth={2}
        shadowColor={playing ? '#22d3ee' : '#000'}
        shadowBlur={playing ? 18 : 6}
        shadowOpacity={playing ? 0.9 : 0.4}
      />
      <Circle x={8} y={-6} radius={14} fill="#0f172a" opacity={0.85} />
      <Circle x={8} y={-6} radius={4} fill={b} />
      <Text
        x={-s / 2 + 4}
        y={s / 2 - 16}
        width={s - 8}
        text={track ? track.title : 'Unknown track'}
        fontSize={8}
        fontStyle="bold"
        fill="#ffffff"
        wrap="none"
        ellipsis
      />
      {playing && <Text x={-s / 2 + 4} y={-s / 2 + 4} text="♪" fontSize={12} fill="#ffffff" />}
    </Group>
  )
}

function Poster({ w, h, color }: { w: number; h: number; color: string }) {
  return (
    <Group>
      <Rect x={-w / 2} y={-h / 2} width={w} height={h} fill="#f8fafc" cornerRadius={2} shadowColor="#000" shadowBlur={6} shadowOpacity={0.4} />
      <Rect
        x={-w / 2 + 3}
        y={-h / 2 + 3}
        width={w - 6}
        height={h - 6}
        fillLinearGradientStartPoint={{ x: 0, y: -h / 2 }}
        fillLinearGradientEndPoint={{ x: 0, y: h / 2 }}
        fillLinearGradientColorStops={[0, shade(color, -90), 1, color]}
      />
      <Star x={0} y={-6} numPoints={5} innerRadius={5} outerRadius={11} fill="#fef9c3" opacity={0.9} />
      <Circle x={-9} y={14} radius={3} fill="#ffffff" opacity={0.7} />
      <Circle x={10} y={18} radius={2} fill="#ffffff" opacity={0.6} />
    </Group>
  )
}

function Rug({ w, h, color }: { w: number; h: number; color: string }) {
  return (
    <Group>
      <Ellipse radiusX={w / 2} radiusY={h / 2} fill={color} opacity={0.85} />
      <Ellipse radiusX={w / 2 - 8} radiusY={h / 2 - 7} stroke={shade(color, 70)} strokeWidth={2} dash={[6, 5]} />
      <Ellipse radiusX={w / 4} radiusY={h / 4} fill={shade(color, -40)} opacity={0.6} />
    </Group>
  )
}

export default function FurnitureNode({ item, track, editable, selected, isPlaying, musicOn, stageScale, onSelect, onMove, onActivate }: Props) {
  const cat = getCatalogItem(item.type)
  const groupRef = useRef<Konva.Group>(null)
  const pulseRef = useRef<Konva.Group>(null)
  const w = item.type === 'album' ? ALBUM_SIZE : cat.w
  const h = item.type === 'album' ? ALBUM_SIZE : cat.h

  // Speakers bounce to the beat while music plays.
  useEffect(() => {
    const node = pulseRef.current
    if (!node || item.type !== 'speaker' || !musicOn) return
    const anim = new Konva.Animation(frame => {
      const s = 1 + 0.07 * Math.abs(Math.sin(((frame?.time ?? 0) / 1000) * Math.PI * 1.6))
      node.scale({ x: s, y: s })
    }, node.getLayer())
    anim.start()
    return () => {
      anim.stop()
      node.scale({ x: 1, y: 1 })
    }
  }, [item.type, musicOn])

  const handleTap = () => {
    if (editable) onSelect?.(item.id)
    else onActivate?.(item)
  }

  const isFloorItem = cat.zone === 'floor' && item.type !== 'rug'

  return (
    <Group
      ref={groupRef}
      x={item.x}
      y={item.y}
      rotation={item.rotation}
      scaleX={item.scale}
      scaleY={item.scale}
      draggable={editable}
      onClick={handleTap}
      onTap={handleTap}
      onDblClick={() => item.type === 'album' && onActivate?.(item)}
      onDblTap={() => item.type === 'album' && onActivate?.(item)}
      onDragStart={() => onSelect?.(item.id)}
      onDragEnd={e => onMove?.(item.id, e.target.x(), e.target.y())}
      dragBoundFunc={pos => ({
        x: Math.min(ROOM_W * stageScale, Math.max(0, pos.x)),
        y: Math.min(ROOM_H * stageScale, Math.max(0, pos.y)),
      })}
      onMouseEnter={e => {
        const stage = e.target.getStage()
        if (stage) stage.container().style.cursor = editable ? 'grab' : item.type === 'album' ? 'pointer' : 'default'
      }}
      onMouseLeave={e => {
        const stage = e.target.getStage()
        if (stage) stage.container().style.cursor = 'default'
      }}
    >
      {isFloorItem && <Ellipse x={0} y={h / 2 - 4} radiusX={w * 0.42} radiusY={7} fill="#000" opacity={0.28} />}

      <Group ref={pulseRef}>
        {item.type === 'album' ? (
          <AlbumArt track={track} playing={isPlaying} />
        ) : item.type === 'poster' ? (
          <Poster w={w} h={h} color={item.color ?? '#22d3ee'} />
        ) : item.type === 'rug' ? (
          <Rug w={w} h={h} color={item.color ?? '#a855f7'} />
        ) : (
          // Emoji glyphs are a bit wider than their font size; never let Konva wrap them onto a hidden line.
          <Text
            x={-w}
            y={-h / 2}
            width={w * 2}
            height={h}
            text={cat.emoji}
            fontSize={Math.min(w, h) * 0.92}
            fontFamily={EMOJI_FONT}
            align="center"
            verticalAlign="middle"
            wrap="none"
            listening={false}
          />
        )}
      </Group>

      {/* Generous invisible hit area so small items are easy to grab on a phone */}
      <Rect x={-w / 2 - 6} y={-h / 2 - 6} width={w + 12} height={h + 12} fill="rgba(0,0,0,0.001)" />

      {selected && (
        <Rect
          x={-w / 2 - 6}
          y={-h / 2 - 6}
          width={w + 12}
          height={h + 12}
          stroke="#22d3ee"
          strokeWidth={2 / item.scale}
          dash={[6, 4]}
          cornerRadius={8}
          listening={false}
        />
      )}
    </Group>
  )
}
