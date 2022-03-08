import { addComponent, addEntity, IWorld } from 'bitecs'
import { Force } from '../components/Force'
import { Input } from '../components/Input'
import { MatterSprite, Sprites } from '../components/MatterSprite'
import { PlayerTag } from '../components/Player'
import { Position } from '../components/Position'
import { Velocity } from '../components/Velocity'

export function createPlayer(world: IWorld, isLocal: boolean = false) {
  const player = addEntity(world)
  addComponent(world, PlayerTag, player)
  addComponent(world, Position, player)
  addComponent(world, Velocity, player)
  addComponent(world, Force, player)
  addComponent(world, MatterSprite, player)
  if (isLocal) addComponent(world, Input, player)

  Position.x[player] = 100
  Position.y[player] = 100
  Velocity.x[player] = 5
  Velocity.y[player] = 5
  MatterSprite.texture[player] = Sprites.Player
  return player
}
