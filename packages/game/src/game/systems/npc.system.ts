import { defineQuery, IWorld } from 'bitecs'
import { Input } from 'phaser'
import { Bounds } from '../components/Bounds'
import { MatterSprite } from '../components/MatterSprite'
import { Position } from '../components/Position'
import { NpcTag, PlayerTag } from '../components/tags'
import { Velocity } from '../components/Velocity'

export function createNpcSystem() {
  const query = defineQuery([NpcTag, Position, Velocity, Bounds])
  return (world: IWorld) => {
    query(world).forEach((id) => {
      if (Bounds.x[id] - Bounds.originX[id] > Position.x[id]) {
        Velocity.x[id] = 2
        MatterSprite.facing[id] = 2
      }
      if (Bounds.x[id] + Bounds.originX[id] < Position.x[id]) {
        Velocity.x[id] = -2
        MatterSprite.facing[id] = 0
      }
      if (Bounds.y[id] - Bounds.originY[id] > Position.y[id]) {
        Velocity.y[id] = -2
      }
      if (Bounds.y[id] + Bounds.originY[id] < Position.y[id]) {
        Velocity.y[id] = 2
      }
    })
    return world
  }
}
