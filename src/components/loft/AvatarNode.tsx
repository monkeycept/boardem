import { useEffect, useRef, useState } from 'react'
import { Ellipse, Group, Label, Rect, Tag, Text } from 'react-konva'
import Konva from 'konva'
import { EMOJI_FONT } from './FurnitureNode'

export interface RoomAvatar {
  id: string
  emoji: string
  name: string
  x: number
  y: number
  bubble?: string
  isMe?: boolean
}

export default function AvatarNode({ avatar }: { avatar: RoomAvatar }) {
  const ref = useRef<Konva.Group>(null)
  const bobRef = useRef<Konva.Group>(null)
  const [initial] = useState({ x: avatar.x, y: avatar.y })

  // Walk smoothly to new positions.
  useEffect(() => {
    const node = ref.current
    if (!node) return
    const dist = Math.hypot(node.x() - avatar.x, node.y() - avatar.y)
    if (dist < 1) return
    const tween = new Konva.Tween({ node, x: avatar.x, y: avatar.y, duration: Math.min(1.6, dist / 160), easing: Konva.Easings.EaseInOut })
    tween.play()
    return () => tween.destroy()
  }, [avatar.x, avatar.y])

  // Gentle idle bob.
  useEffect(() => {
    const node = bobRef.current
    if (!node) return
    const offset = Math.random() * 1000
    const anim = new Konva.Animation(frame => {
      node.y(Math.sin(((frame?.time ?? 0) + offset) / 380) * 2.2)
    }, node.getLayer())
    anim.start()
    return () => {
      anim.stop()
    }
  }, [])

  const nameWidth = Math.max(36, avatar.name.length * 6.5 + 12)

  return (
    <Group ref={ref} x={initial.x} y={initial.y} listening={false}>
      <Ellipse x={0} y={16} radiusX={16} radiusY={5} fill="#000" opacity={0.35} />
      {avatar.isMe && <Ellipse x={0} y={16} radiusX={20} radiusY={7} stroke="#22d3ee" strokeWidth={2} opacity={0.9} />}
      <Group ref={bobRef}>
        <Text x={-30} y={-24} width={60} height={40} text={avatar.emoji} fontSize={32} fontFamily={EMOJI_FONT} align="center" verticalAlign="middle" wrap="none" />
      </Group>
      <Rect x={-nameWidth / 2} y={24} width={nameWidth} height={15} cornerRadius={8} fill="#020617" opacity={0.7} />
      <Text x={-nameWidth / 2} y={27} width={nameWidth} text={avatar.name} fontSize={10} fontStyle="bold" fill={avatar.isMe ? '#67e8f9' : '#e2e8f0'} align="center" />
      {avatar.bubble && (
        <Label x={0} y={-30}>
          <Tag fill="#f8fafc" pointerDirection="down" pointerWidth={10} pointerHeight={7} cornerRadius={10} shadowColor="#000" shadowBlur={8} shadowOpacity={0.3} />
          <Text text={avatar.bubble.length > 60 ? `${avatar.bubble.slice(0, 58)}…` : avatar.bubble} fontSize={11} padding={7} fill="#0f172a" width={avatar.bubble.length > 22 ? 150 : undefined} wrap="word" />
        </Label>
      )}
    </Group>
  )
}
