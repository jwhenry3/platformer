import { defineQuery, enterQuery, exitQuery, IWorld } from 'bitecs'
import Phaser from 'phaser'
import { Entity, syncEntityAnimations } from '../components/Entity'
import { syncMatterForce } from '../components/Force'
import {
  createEntitySprite,
  createProjectileSprite,
  getTexture,
  MatterSprite,
  syncMatterSprite
} from '../components/MatterSprite'
import {
  getPosition,
  Position,
  setPosition,
  syncMatterPosition
} from '../components/Position'
import { Projectile, syncProjectileAnimations } from '../components/Projectile'
import { syncMatterVelocity, Velocity } from '../components/Velocity'

export const matterSpritesById = new Map<number, Phaser.Physics.Matter.Sprite>()
export function getSprite(
  id: number,
  onRetrieved: (sprite: Phaser.Physics.Matter.Sprite) => void
) {
  const sprite = matterSpritesById.get(id) as Phaser.Physics.Matter.Sprite
  if (sprite) {
    onRetrieved(sprite)
  }
}
export function destroySprite(id: number) {
  getSprite(id, (sprite) => {
    sprite.destroy()
    matterSpritesById.delete(id)
  })
}
export function syncSprite(id: number) {
  getSprite(id, (sprite) => {
    syncMatterPosition(id, sprite)
    syncMatterForce(id, sprite)
  })
}

export function createEntityMatterSystem(
  matter: Phaser.Physics.Matter.MatterPhysics
) {
  const matterQuery = defineQuery([MatterSprite, Entity])
  const matterQueryEnter = enterQuery(matterQuery)
  const matterQueryExit = exitQuery(matterQuery)
  return (world: IWorld) => {
    matterQueryEnter(world).forEach((id) => {
      const [x, y] = getPosition(id)
      matterSpritesById.set(id, createEntitySprite(matter, id, x, y))
    })
    matterQuery(world).forEach((id) => syncSprite(id))
    matterQueryExit(world).forEach((id) => destroySprite(id))

    return world
  }
}

export function createProjectileMatterSystem(
  matter: Phaser.Physics.Matter.MatterPhysics
) {
  const matterQuery = defineQuery([MatterSprite, Projectile])
  const matterQueryEnter = enterQuery(matterQuery)
  const matterQueryExit = exitQuery(matterQuery)
  return (world: IWorld) => {
    matterQueryEnter(world).forEach((id) => {
      const [x, y] = getPosition(id)
      matterSpritesById.set(id, createProjectileSprite(matter, id, x, y))
    })
    matterQuery(world).forEach((id) => {
      syncSprite(id)
    })
    matterQueryExit(world).forEach((id) => destroySprite(id))

    return world
  }
}

export function createMatterPhysicsSystem() {
  const entityQuery = defineQuery([MatterSprite, Position, Entity])
  const projectileQuery = defineQuery([MatterSprite, Position, Projectile])
  return (world: IWorld) => {
    entityQuery(world).forEach((id) =>
      getSprite(id, (sprite) => {
        syncMatterVelocity(id, sprite)
        syncMatterSprite(id, sprite)
        syncEntityAnimations(id, sprite)
      })
    )
    projectileQuery(world).forEach((id) =>
      getSprite(id, (sprite) => {
        syncMatterVelocity(id, sprite)
        syncMatterSprite(id, sprite)
        syncProjectileAnimations(id, sprite)
      })
    )
  }
}

export function createMatterPhysicsSyncSystem() {
  const matterQuery = defineQuery([MatterSprite, Position])
  return (world: IWorld) => {
    matterQuery(world).forEach((id) =>
      getSprite(id, (sprite) => {
        syncMatterVelocity(id, sprite, false)
        syncMatterPosition(id, sprite, false)
      })
    )
  }
}
