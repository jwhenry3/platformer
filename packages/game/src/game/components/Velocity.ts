import { defineComponent, Types } from 'bitecs'

export const Velocity = defineComponent({
  x: Types.f32,
  y: Types.f32
})

export function getVelocity(id: number) {
  return [Velocity.x[id], Velocity.y[id]]
}

export function setMatterVelocity(id: number, x?: number, y?: number) {
  Velocity.x[id] = typeof x === 'undefined' ? Velocity.x[id] : x
  Velocity.y[id] = typeof y === 'undefined' ? Velocity.y[id] : y
}

export function syncMatterVelocity(
  id: number,
  sprite: Phaser.Physics.Matter.Sprite,
  toSprite = true
) {
  if (toSprite) {
    sprite.setVelocity(Velocity.x[id], Velocity.y[id])
  } else {
    Velocity.x[id] = sprite.body.velocity.x
    Velocity.y[id] = sprite.body.velocity.y
  }
}
