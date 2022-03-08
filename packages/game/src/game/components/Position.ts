import { defineComponent, Types } from 'bitecs'

export const Position = defineComponent({
  x: Types.f32,
  y: Types.f32
})

export function getPosition(id: number) {
  return [Position.x[id], Position.y[id]]
}

export function setPosition(id: number, x?: number, y?: number) {
  Position.x[id] = typeof x === 'undefined' ? Position.x[id] : x
  Position.y[id] = typeof y === 'undefined' ? Position.y[id] : y
}

export function syncMatterPosition(
  id: number,
  sprite: Phaser.Physics.Matter.Sprite,
  toSprite = true
) {
  if (toSprite) {
    sprite.x = Position.x[id]
    sprite.y = Position.y[id]
  } else {
    Position.x[id] = sprite.x
    Position.y[id] = sprite.y
  }
}
