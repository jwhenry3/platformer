import { defineComponent, Types } from 'bitecs'
import { Body } from './Body'
import { Input } from './Input'
import { CollisionGroups, MatterSprite } from './MatterSprite'

export const Velocity = defineComponent({
  x: Types.f32,
  y: Types.f32,
  keepX: Types.f32,
  onGround: Types.f32
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
    if (Input.down[id] && Input.jump[id]) {
      Body.fallingThroughPlatform[id] = 1
      sprite.setCollidesWith([CollisionGroups.Floors])
      setTimeout(() => {
        if (Body.fallingThroughPlatform[id]) {
          Body.fallingThroughPlatform[id] = 0
          sprite.setCollidesWith([
            CollisionGroups.Floors,
            CollisionGroups.Platforms
          ])
        }
      }, 100)
    }
    if (!Body.fallingThroughPlatform[id]) {
      if (Velocity.y[id] < 0) {
        sprite.setCollidesWith([CollisionGroups.Floors])
      } else {
        sprite.setCollidesWith([
          CollisionGroups.Floors,
          CollisionGroups.Platforms
        ])
      }
    }
    sprite.setVelocity(Velocity.x[id], Velocity.y[id])
    sprite.rotation = 0
  } else {
    if (!Velocity.keepX[id]) {
      Velocity.x[id] = sprite.body.velocity.x
    }
    Velocity.y[id] = sprite.body.velocity.y
    if (Math.abs(Velocity.y[id]) < 0.5) Velocity.y[id] = 0
  }
}
