import { CollisionGroups } from '../components/MatterSprite'
import { Velocity } from '../components/Velocity'
import { getSprite } from '../systems/matter.system'

export function createFallSensor(
  matter: Phaser.Physics.Matter.MatterPhysics,
  x: number,
  y: number,
  width: number
) {
  const rect = matter.add.rectangle(x, y, width, 64, {
    isStatic: true,
    isSensor: true,
    collisionFilter: { category: CollisionGroups.Floors }
  })
}
