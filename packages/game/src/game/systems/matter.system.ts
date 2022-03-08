import { defineQuery, enterQuery, exitQuery, IWorld } from 'bitecs'
import Phaser from 'phaser'
import { syncMatterForce } from '../components/Force'
import {
  createMatterSprite,
  getTexture,
  MatterSprite
} from '../components/MatterSprite'
import {
  getPosition,
  Position,
  setPosition,
  syncMatterPosition
} from '../components/Position'
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

export function createSprite(
  matter: Phaser.Physics.Matter.MatterPhysics,
  id: number
) {
  const [x, y] = getPosition(id)
  matterSpritesById.set(id, createMatterSprite(matter, id, x, y))
}

export function createMatterSystem(
  matter: Phaser.Physics.Matter.MatterPhysics
) {
  const matterQuery = defineQuery([MatterSprite])
  const matterQueryEnter = enterQuery(matterQuery)
  const matterQueryExit = exitQuery(matterQuery)
  return (world: IWorld) => {
    matterQueryEnter(world).forEach((id) => createSprite(matter, id))
    matterQuery(world).forEach((id) => syncSprite(id))
    matterQueryExit(world).forEach((id) => destroySprite(id))

    return world
  }
}

export function createMatterPhysicsSystem() {
  const query = defineQuery([Velocity, MatterSprite])
  return (world: IWorld) => {
    query(world).forEach((id) =>
      getSprite(id, (sprite) => syncMatterVelocity(id, sprite))
    )
    return world
  }
}

export function createMatterPhysicsSyncSystem() {
  const matterQuery = defineQuery([MatterSprite, Position])
  return (world: IWorld) => {
    matterQuery(world).forEach((id) =>
      getSprite(id, (sprite) => syncMatterPosition(id, sprite, false))
    )
  }
}
