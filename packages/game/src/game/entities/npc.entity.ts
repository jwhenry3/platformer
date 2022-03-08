import { addComponent, addEntity, IWorld } from 'bitecs'
import { Bounds } from '../components/Bounds'
import { MatterSprite, Sprites } from '../components/MatterSprite'
import { Position } from '../components/Position'
import { NpcTag } from '../components/tags'
import { Velocity } from '../components/Velocity'

export function createNpc(world: IWorld, type?: string) {
  const npc = addEntity(world)
  addComponent(world, NpcTag, npc)
  addComponent(world, Position, npc)
  addComponent(world, Bounds, npc)
  addComponent(world, Velocity, npc)
  addComponent(world, MatterSprite, npc)

  Position.x[npc] = 400
  Position.y[npc] = 540
  Velocity.keepX[npc] = 1
  Velocity.x[npc] = 2
  Velocity.y[npc] = 0
  Bounds.x[npc] = Position.x[npc]
  Bounds.y[npc] = Position.y[npc]
  Bounds.originX[npc] = 200
  Bounds.originY[npc] = 120
  Bounds.width[npc] = 400
  Bounds.height[npc] = 240
  MatterSprite.texture[npc] = Sprites.Player
  MatterSprite.facing[npc] = 1
  return npc
}
