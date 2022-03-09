import { addComponent, addEntity, IWorld } from 'bitecs'
import { Force } from '../components/Force'
import { Input } from '../components/Input'
import { MatterSprite, Sprites } from '../components/MatterSprite'
import { PlayerTag } from '../components/tags'
import { Position } from '../components/Position'
import { Velocity } from '../components/Velocity'
import { Entity } from '../components/Entity'
import { ActionStatus } from '../components/Action'

export function createPlayer(world: IWorld, isLocal: boolean = false) {
  const player = addEntity(world)
  addComponent(world, Entity, player)
  addComponent(world, PlayerTag, player)
  addComponent(world, Position, player)
  addComponent(world, Velocity, player)
  addComponent(world, Force, player)
  addComponent(world, MatterSprite, player)
  addComponent(world, ActionStatus, player)
  if (isLocal) addComponent(world, Input, player)

  PlayerTag.isLocal[player] = Number(isLocal)

  Position.x[player] = 100
  Position.y[player] = 100
  Velocity.x[player] = 5
  Velocity.y[player] = 5
  MatterSprite.texture[player] = Sprites.Player
  MatterSprite.facing[player] = 1
  Input.shootDelayAmount[player] = 30
  // global cooldown for actions
  Input.actionDelayAmount[player] = 10
  return player
}
