import { CollisionGroups } from '../components/MatterSprite'

export function createPlatform(
  matter: Phaser.Physics.Matter.MatterPhysics,
  x: number,
  y: number,
  width: number
) {
  const platform = matter.add.rectangle(x, y, 1000, 1, {
    isStatic: true,
    collisionFilter: {
      category: CollisionGroups.Platforms,
      mask: CollisionGroups.MovableEntities
    }
  })
  platform.type = 'platform'
  return platform
}
