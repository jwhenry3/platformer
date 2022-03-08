import { defineComponent, Types } from 'bitecs'
import { Velocity } from './Velocity'

export enum Sprites {
  Player = 0
}
export const TextureKeys = ['player']

export enum CollisionGroups {
  MovableEntities = 2,
  Floors = 4,
  Platforms = 6
}

export const MatterSprite = defineComponent({
  texture: Types.ui8,
  facing: Types.ui8
})

export function getTexture(id: number) {
  return TextureKeys[MatterSprite.texture[id] || 0] || 'none'
}

export function createMatterSprite(
  matter: Phaser.Physics.Matter.MatterPhysics,
  id: number,
  x: number,
  y: number
) {
  const sprite = matter.add.sprite(x, y, getTexture(id))
  sprite.type = 'entity'
  sprite.setMass(1)
  sprite.setVelocity(0, 0)
  sprite.setOnCollide((e: any) => {
    if (e.bodyA.type === 'ground' || e.bodyB.type === 'ground') {
      console.log('landing!')
      Velocity.onGround[id] = 1
    }
  })
  sprite.setOnCollideEnd((e: any) => {
    if (e.bodyA.type === 'ground' || e.bodyB.type === 'ground') {
      console.log('jump!')
      Velocity.onGround[id] = 0
    }
  })
  sprite.setCollisionCategory(CollisionGroups.MovableEntities)
  sprite.setCollidesWith(CollisionGroups.Floors)
  return sprite
}

export function syncMatterSprite(
  id: number,
  sprite: Phaser.Physics.Matter.Sprite
) {
  // turns the entity left or right based on npc direction or player movement
  sprite.setScale(MatterSprite.facing[id] === 0 ? -1 : 1, 1)
}
