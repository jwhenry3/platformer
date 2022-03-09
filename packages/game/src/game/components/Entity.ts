import { defineComponent } from 'bitecs'
import { Velocity } from './Velocity'

export const Entity = defineComponent({})

export function syncEntityAnimations(
  id: number,
  sprite: Phaser.Physics.Matter.Sprite
) {
  if (!Velocity.onGround[id]) {
    if (sprite.anims.getName() !== 'jump') {
      sprite.play('jump')
    }
    return
  }
  if (Velocity.x[id] !== 0 && sprite.anims.getName() !== 'run') {
    sprite.play('run')
  } else if (Velocity.x[id] === 0 && sprite.anims.getName() !== 'stand') {
    sprite.play('stand')
  }
}
