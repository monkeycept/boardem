import { useEffect, useRef } from 'react'
import { ui, wada } from '../../theme/wada'
import { Circle, Ellipse, Group, Image as KonvaImage, Rect, Star, Text } from 'react-konva'
import Konva from 'konva'
import { FurnitureItem, Track } from '../../types'
import { ALBUM_SIZE, getCatalogItem, ROOM_H, ROOM_W } from '../../lib/room'
import { FURNITURE_ART, useCanvasImage } from '../../lib/art'

export const EMOJI_FONT = '"Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif'

interface Props {
  item: FurnitureItem
  /** Where physics currently has this item (overrides the saved position while moving). */
  pose?: { x: number; y: number; rotation: number }
  track?: Track
  editable: boolean
  /** Physics is settling: items can still be selected, just not dragged. */
  locked?: boolean
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
  const [a, b] = track?.colors ?? [wada.plumbeous, wada.neutralGray]
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
        stroke={wada.sulpherYellow}
        strokeWidth={2}
        shadowColor={playing ? ui.accent : '#000'}
        shadowBlur={playing ? 18 : 6}
        shadowOpacity={playing ? 0.9 : 0.4}
      />
      <Circle x={8} y={-6} radius={14} fill={ui.ground} opacity={0.85} />
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
      <Rect x={-w / 2} y={-h / 2} width={w} height={h} fill={wada.sulpherYellow} cornerRadius={2} shadowColor="#000" shadowBlur={6} shadowOpacity={0.4} />
      <Rect
        x={-w / 2 + 3}
        y={-h / 2 + 3}
        width={w - 6}
        height={h - 6}
        fillLinearGradientStartPoint={{ x: 0, y: -h / 2 }}
        fillLinearGradientEndPoint={{ x: 0, y: h / 2 }}
        fillLinearGradientColorStops={[0, shade(color, -90), 1, color]}
      />
      <Star x={0} y={-6} numPoints={5} innerRadius={5} outerRadius={11} fill={wada.sulpherYellow} opacity={0.95} />
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

export default function FurnitureNode({ item, pose, track, editable, locked = false, selected, isPlaying, musicOn, stageScale, onSelect, onMove, onActivate }: Props) {
  const cat = getCatalogItem(item.type)
  const groupRef = useRef<Konva.Group>(null)
  const pulseRef = useRef<Konva.Group>(null)
  const w = item.type === 'album' ? ALBUM_SIZE : cat.w
  const h = item.type === 'album' ? ALBUM_SIZE : cat.h
  const artImg = useCanvasImage(FURNITURE_ART[item.type])
  // The artwork is square; fit it to the item's footprint, sitting on its base line.
  const artSize = Math.max(w, h) * 1.05

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
      x={pose?.x ?? item.x}
      y={pose?.y ?? item.y}
      rotation={pose?.rotation ?? item.rotation}
      scaleX={item.scale}
      scaleY={item.scale}
      draggable={editable && !locked}
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
          <Poster w={w} h={h} color={item.color ?? wada.jasperRed} />
        ) : item.type === 'rug' ? (
          <Rug w={w} h={h} color={item.color ?? wada.benzolGreen} />
        ) : artImg ? (
          <KonvaImage image={artImg} x={-artSize / 2} y={h / 2 - artSize} width={artSize} height={artSize} listening={false} />
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
          stroke={ui.accentLight}
          strokeWidth={2 / item.scale}
          dash={[6, 4]}
          cornerRadius={8}
          listening={false}
        />
      )}
    </Group>
  )
}
