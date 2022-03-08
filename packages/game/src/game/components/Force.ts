import { defineComponent, Types } from 'bitecs'

export const Force = defineComponent({
  x: Types.f32,
  y: Types.f32
})

export function setMatterForce(id: number, x?: number, y?: number) {
  Force.x[id] = typeof x === 'undefined' ? Force.x[id] : x
  Force.y[id] = typeof y === 'undefined' ? Force.y[id] : y
}

export function syncMatterForce(
  id: number,
  sprite: Phaser.Physics.Matter.Sprite,
  toSprite = false
) {
  if (toSprite) {
    if (Force.x[id] !== 0 || Force.y[id] !== 0)
      sprite.applyForce(new Phaser.Math.Vector2(Force.x[id], Force.y[id]))
  }
}
