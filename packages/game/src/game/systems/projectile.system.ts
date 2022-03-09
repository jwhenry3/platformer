import { defineQuery, IWorld, removeEntity } from 'bitecs'
import { Input } from '../components/Input'
import { Position } from '../components/Position'
import { Projectile } from '../components/Projectile'
import { PlayerTag } from '../components/tags'
import { Velocity } from '../components/Velocity'
import { createProjectile } from '../entities/projectile.entity'

export function createProjectileSystem(
  matter: Phaser.Physics.Matter.MatterPhysics
) {
  const query = defineQuery([PlayerTag, Input])
  const projectileQuery = defineQuery([Projectile, Velocity])
  return (world: IWorld) => {
    query(world).forEach((id) => {
      if (Input.shootDelay[id] > 0) Input.shootDelay[id]--
      if (Input.actionDelay[id] === 0)
        if (Input.shoot[id] && Input.shootDelay[id] === 0) {
          Input.shootDelay[id] = Input.shootDelayAmount[id]
          createProjectile(world, id)
        }
    })
    projectileQuery(world).forEach((id) => {
      Velocity.x[id] = (Projectile.direction[id] - 1) * 5
      Velocity.y[id] = -0.56
      if (
        Math.abs(Position.x[id] - Projectile.originalX[id]) >
        Projectile.distance[id]
      ) {
        removeEntity(world, id)
      }
    })
    return world
  }
}
