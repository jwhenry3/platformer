import { defineComponent, Types } from 'bitecs'

export enum Sprites {
  Player = 0
}
export const TextureKeys = ['player']

export const MatterSprite = defineComponent({
  texture: Types.ui8
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
  const sprite = matter.add.sprite(0, 0, getTexture(id))
  sprite.setMass(1)
  sprite.setVelocity(0, 0)
  return sprite
}
