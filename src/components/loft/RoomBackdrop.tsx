import { useMemo } from 'react'
import { ui, wada } from '../../theme/wada'
import { Ellipse, Group, Line, Rect } from 'react-konva'
import { getFloor, getWallpaper, ROOM_H, ROOM_W, WALL_H } from '../../lib/room'

interface Props {
  wallpaper: string
  flooring: string
}

const FLOOR_H = ROOM_H - WALL_H

function FloorPattern({ flooringId }: { flooringId: string }) {
  const floor = getFloor(flooringId)
  const shapes = useMemo(() => {
    const out: JSX.Element[] = []
    const line = (key: string, points: number[], opacity = 0.5, width = 1) =>
      out.push(<Line key={key} points={points} stroke={floor.line} strokeWidth={width} opacity={opacity} listening={false} />)

    switch (floor.pattern) {
      case 'planks': {
        const h = 22
        for (let row = 0, y = WALL_H; y < ROOM_H; row++, y += h) {
          line(`h${row}`, [0, y, ROOM_W, y], 0.7)
          const offset = row % 2 ? 60 : 0
          for (let x = offset; x < ROOM_W; x += 120) line(`v${row}-${x}`, [x, y, x, y + h], 0.6)
        }
        break
      }
      case 'tiles':
        for (let x = 0; x <= ROOM_W; x += 46) line(`tx${x}`, [x, WALL_H, x, ROOM_H], 0.45)
        for (let y = WALL_H; y <= ROOM_H; y += 46) line(`ty${y}`, [0, y, ROOM_W, y], 0.45)
        break
      case 'grid':
        for (let x = -ROOM_W; x <= ROOM_W * 2; x += 46) line(`gx${x}`, [ROOM_W / 2 + (x - ROOM_W / 2) * 0.35, WALL_H, x, ROOM_H], 0.55, 1.2)
        for (let i = 0, y = WALL_H; y < ROOM_H; i++, y += 8 + i * 5) line(`gy${y}`, [0, y, ROOM_W, y], 0.55, 1.2)
        break
      case 'checker': {
        const s = 38
        for (let r = 0, y = WALL_H; y < ROOM_H; r++, y += s)
          for (let c = 0, x = 0; x < ROOM_W; c++, x += s)
            if ((r + c) % 2) out.push(<Rect key={`c${r}-${c}`} x={x} y={y} width={s} height={s} fill={floor.line} opacity={0.75} listening={false} />)
        break
      }
      case 'mats':
        for (let r = 0, y = WALL_H; y < ROOM_H; r++, y += 46)
          for (let x = r % 2 ? -46 : 0; x < ROOM_W; x += 92)
            out.push(<Rect key={`m${r}-${x}`} x={x + 2} y={y + 2} width={88} height={42} stroke={floor.line} strokeWidth={2} opacity={0.6} listening={false} />)
        break
      case 'plain':
        for (let i = 0; i < 70; i++) {
          const x = (i * 97) % ROOM_W
          const y = WALL_H + ((i * 53) % FLOOR_H)
          out.push(<Ellipse key={`p${i}`} x={x} y={y} radiusX={10} radiusY={4} fill={floor.line} opacity={0.18} listening={false} />)
        }
        break
    }
    return out
  }, [floor])
  return <Group>{shapes}</Group>
}

function CabinWindow({ x }: { x: number }) {
  return (
    <Group x={x} y={64} listening={false}>
      <Rect x={-20} y={-30} width={40} height={60} cornerRadius={20} fill={ui.shadow} opacity={0.6} />
      <Rect
        x={-16}
        y={-26}
        width={32}
        height={52}
        cornerRadius={16}
        fillLinearGradientStartPoint={{ x: 0, y: -26 }}
        fillLinearGradientEndPoint={{ x: 0, y: 26 }}
        // Dusk outside the window: Deep Lyons Blue → Pale King's Blue → Cream Yellow
        fillLinearGradientColorStops={[0, wada.deepLyonsBlue, 0.6, wada.paleKingsBlue, 1, wada.creamYellow]}
      />
      <Ellipse x={-4} y={8} radiusX={9} radiusY={4} fill="#ffffff" opacity={0.7} />
      <Ellipse x={6} y={10} radiusX={7} radiusY={3} fill="#ffffff" opacity={0.6} />
    </Group>
  )
}

export default function RoomBackdrop({ wallpaper, flooring }: Props) {
  const wall = getWallpaper(wallpaper)
  const floor = getFloor(flooring)
  return (
    <Group>
      {/* Wall */}
      <Rect
        name="wall"
        x={0}
        y={0}
        width={ROOM_W}
        height={WALL_H}
        fillLinearGradientStartPoint={{ x: 0, y: 0 }}
        fillLinearGradientEndPoint={{ x: 0, y: WALL_H }}
        fillLinearGradientColorStops={[0, wall.top, 1, wall.bottom]}
      />
      {Array.from({ length: 12 }, (_, i) => (
        <Rect key={i} x={i * 40 + 18} y={0} width={4} height={WALL_H} fill={wall.accent} opacity={0.05} listening={false} />
      ))}
      <CabinWindow x={30} />
      <CabinWindow x={ROOM_W - 30} />

      {/* Floor */}
      <Rect
        name="floor"
        x={0}
        y={WALL_H}
        width={ROOM_W}
        height={FLOOR_H}
        fillLinearGradientStartPoint={{ x: 0, y: WALL_H }}
        fillLinearGradientEndPoint={{ x: 0, y: ROOM_H }}
        fillLinearGradientColorStops={[0, floor.base, 1, floor.base]}
      />
      <FloorPattern flooringId={flooring} />
      {/* Shade where the wall meets the floor */}
      <Rect
        x={0}
        y={WALL_H}
        width={ROOM_W}
        height={40}
        listening={false}
        fillLinearGradientStartPoint={{ x: 0, y: WALL_H }}
        fillLinearGradientEndPoint={{ x: 0, y: WALL_H + 40 }}
        fillLinearGradientColorStops={[0, 'rgba(0,0,0,0.35)', 1, 'rgba(0,0,0,0)']}
      />
      <Rect x={0} y={WALL_H - 6} width={ROOM_W} height={7} fill="#000000" opacity={0.35} listening={false} />
    </Group>
  )
}

export function RoomVignette() {
  return (
    <Rect
      x={0}
      y={0}
      width={ROOM_W}
      height={ROOM_H}
      listening={false}
      fillRadialGradientStartPoint={{ x: ROOM_W / 2, y: ROOM_H / 2 }}
      fillRadialGradientEndPoint={{ x: ROOM_W / 2, y: ROOM_H / 2 }}
      fillRadialGradientStartRadius={ROOM_H * 0.35}
      fillRadialGradientEndRadius={ROOM_W * 0.75}
      fillRadialGradientColorStops={[0, 'rgba(5,18,48,0)', 1, 'rgba(5,18,48,0.55)']}
    />
  )
}
