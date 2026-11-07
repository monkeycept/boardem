import { useEffect, useRef, useState } from 'react'
import { Layer, Stage } from 'react-konva'
import Konva from 'konva'
import { FurnitureItem, Track } from '../../types'
import { ROOM_H, ROOM_W } from '../../lib/room'
import RoomBackdrop, { RoomVignette } from './RoomBackdrop'
import FurnitureNode from './FurnitureNode'
import AvatarNode, { RoomAvatar } from './AvatarNode'

interface Props {
  furniture: FurnitureItem[]
  wallpaper: string
  flooring: string
  tracks: Track[]
  playingTrackId: string | null
  editable?: boolean
  selectedId?: string | null
  avatars?: RoomAvatar[]
  onSelect?: (id: string | null) => void
  onMove?: (id: string, x: number, y: number) => void
  onActivate?: (item: FurnitureItem) => void
  onFloorTap?: (x: number, y: number) => void
}

/** Renders a loft at the largest size that fits its container. */
export default function RoomStage({
  furniture,
  wallpaper,
  flooring,
  tracks,
  playingTrackId,
  editable = false,
  selectedId = null,
  avatars = [],
  onSelect,
  onMove,
  onActivate,
  onFloorTap,
}: Props) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const [box, setBox] = useState({ w: 0, h: 0 })

  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const measure = () => setBox({ w: el.clientWidth, h: el.clientHeight })
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const scale = box.w && box.h ? Math.min(box.w / ROOM_W, box.h / ROOM_H) : 0
  const sorted = [...furniture].sort((a, b) => a.zIndex - b.zIndex)
  const musicOn = Boolean(playingTrackId)

  const handleBackgroundTap = (e: Konva.KonvaEventObject<MouseEvent | TouchEvent>) => {
    const name = e.target.name()
    const isBackground = e.target === e.target.getStage() || name === 'floor' || name === 'wall'
    if (!isBackground) return
    onSelect?.(null)
    if (onFloorTap) {
      const p = e.target.getStage()?.getPointerPosition()
      if (p) onFloorTap(p.x / scale, p.y / scale)
    }
  }

  return (
    <div ref={wrapRef} className="w-full h-full flex items-center justify-center overflow-hidden">
      {scale > 0 && (
        <div className="rounded-2xl overflow-hidden shadow-2xl shadow-black/60 ring-1 ring-white/10">
          <Stage
            width={Math.floor(ROOM_W * scale)}
            height={Math.floor(ROOM_H * scale)}
            scaleX={scale}
            scaleY={scale}
            onClick={handleBackgroundTap}
            onTap={handleBackgroundTap}
          >
            <Layer>
              <RoomBackdrop wallpaper={wallpaper} flooring={flooring} />
              {sorted.map(item => (
                <FurnitureNode
                  key={item.id}
                  item={item}
                  track={item.trackId ? tracks.find(t => t.id === item.trackId) : undefined}
                  editable={editable}
                  selected={selectedId === item.id}
                  isPlaying={item.type === 'album' && item.trackId === playingTrackId}
                  musicOn={musicOn}
                  stageScale={scale}
                  onSelect={id => onSelect?.(id)}
                  onMove={onMove}
                  onActivate={onActivate}
                />
              ))}
              {[...avatars].sort((a, b) => a.y - b.y).map(a => (
                <AvatarNode key={a.id} avatar={a} />
              ))}
              <RoomVignette />
            </Layer>
          </Stage>
        </div>
      )}
    </div>
  )
}
