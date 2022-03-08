import { addComponent, addEntity, IWorld } from 'bitecs'
import { Sprites } from '../components/MatterSprite'
import { Position } from '../components/Position'
import { Sprite } from '../components/Sprite'
import { Velocity } from '../components/Velocity'

export function createNpc(world: IWorld, type?: 'string') {
  const player = addEntity(world)
  addComponent(world, Position, player)
  addComponent(world, Velocity, player)
  addComponent(world, Sprite, player)

  Position.x[player] = 100
  Position.y[player] = 100
  Velocity.x[player] = 5
  Velocity.y[player] = 5
  Sprite.texture[player] = Sprites.Player
  return player
}
