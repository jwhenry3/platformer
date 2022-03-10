import { addComponent, addEntity, IWorld } from 'bitecs'
import { Input } from 'phaser'
import { Body } from '../components/Body'
import { Force } from '../components/Force'
import { MatterSprite, Sprites } from '../components/MatterSprite'
import { Position } from '../components/Position'
import { Projectile } from '../components/Projectile'
import { Velocity } from '../components/Velocity'

export function createFireball(world: IWorld, owner: number) {
  const projectile = addEntity(world)
  addComponent(world, Body, projectile)
  addComponent(world, Projectile, projectile)
  addComponent(world, Position, projectile)
  addComponent(world, Velocity, projectile)
  addComponent(world, Force, projectile)
  addComponent(world, MatterSprite, projectile)

  const facingValue =
    MatterSprite.facing[owner] === 1 ? 2 : MatterSprite.facing[owner]
  const direction = facingValue - 1
  Position.x[projectile] = Position.x[owner] + 64 * direction
  Position.y[projectile] = Position.y[owner] - 32
  Velocity.x[projectile] = (Projectile.direction[projectile] - 1) * Projectile.speed[projectile]
  Velocity.y[projectile] = 0
  Projectile.owner[projectile] = owner
  Projectile.distance[projectile] = 1000 // add skill modifier
  Projectile.originalX[projectile] = Position.x[projectile]
  Projectile.originalY[projectile] = Position.y[projectile]
  Projectile.direction[projectile] = facingValue
  Projectile.speed[projectile] = 10 // add skill modifier

  MatterSprite.texture[projectile] = Sprites.Fireball
  MatterSprite.facing[projectile] = facingValue
  return projectile
}
