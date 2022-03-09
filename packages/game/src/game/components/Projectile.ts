import { defineComponent, Types } from 'bitecs'

export const Projectile = defineComponent({
  owner: Types.ui8,
  direction: Types.ui8,
  speed: Types.ui8,
  distance: Types.f32,
  originalX: Types.f32,
  originalY: Types.f32,
  actionIdOnHit: Types.ui32
})

export function syncProjectileAnimations(
  id: number,
  sprite: Phaser.Physics.Matter.Sprite
) {
  if (sprite.anims.getName() !== 'fireball') {
    sprite.play('fireball')
  }
}
