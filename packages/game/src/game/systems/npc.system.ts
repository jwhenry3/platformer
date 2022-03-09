import { defineQuery, IWorld } from 'bitecs'
import { Input } from 'phaser'
import { Bounds } from '../components/Bounds'
import { Force } from '../components/Force'
import { MatterSprite } from '../components/MatterSprite'
import { Position } from '../components/Position'
import { NpcTag, PlayerTag } from '../components/tags'
import { Velocity } from '../components/Velocity'

export function createNpcSystem() {
  const query = defineQuery([NpcTag, Position, Velocity, Bounds])
  return (world: IWorld) => {
    query(world).forEach((id) => {
      if (Velocity.onGround[id]) {
        Velocity.x[id] = (NpcTag.direction[id] - 1) * 2
        MatterSprite.facing[id] = NpcTag.direction[id]
        if (Bounds.x[id] - Bounds.originX[id] > Position.x[id]) {
          NpcTag.direction[id] = 2
        }
        if (Bounds.x[id] + Bounds.originX[id] < Position.x[id]) {
          NpcTag.direction[id] = 0
        }
      }
    })
    return world
  }
}
