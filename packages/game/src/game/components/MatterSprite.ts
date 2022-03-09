import { strictEqual } from 'assert'
import { defineComponent, Types } from 'bitecs'
import { actionStatuses } from './Action'
import { Body } from './Body'
import { Projectile } from './Projectile'
import { Velocity } from './Velocity'

export enum Sprites {
  Player = 0,
  Fireball = 1
}
export const TextureKeys = ['player', 'fireball']

export const CollisionGroups = {
  MovableEntities: -1,
  Floors: 2,
  Platforms: 4,
  Projectiles: 6
}
export const GroundedCollisionTypes = ['ground', 'platform']
export const GroundedCollisionGroups = [
  CollisionGroups.Floors,
  CollisionGroups.Platforms
]
export function isBodyGround(body: MatterJS.BodyType) {
  return GroundedCollisionTypes.includes(body.type)
}
export const MatterSprite = defineComponent({
  texture: Types.ui8,
  facing: Types.ui8,
  movementDirection: Types.ui8
})

export function getTexture(id: number) {
  console.log(MatterSprite.texture[id], TextureKeys[MatterSprite.texture[id]])
  return TextureKeys[MatterSprite.texture[id] || 0] || 'none'
}
export function createProjectileSprite(
  matter: Phaser.Physics.Matter.MatterPhysics,
  id: number,
  x: number,
  y: number
) {
  const sprite = matter.add.sprite(x, y, getTexture(id))
  sprite.type = 'projectile'
  sprite.setData({
    entityId: id,
    isProjectile: true,
    actionId: Projectile.actionIdOnHit[id],
    owner: Projectile.owner[id]
  })
  sprite.setOnCollide(
    ({
      bodyA,
      bodyB
    }: {
      bodyA: MatterJS.BodyType
      bodyB: MatterJS.BodyType
    }) => {
      const aData = bodyA.gameObject?.data.values
      const bData = bodyB.gameObject?.data.values
      const other = aData?.entityId !== id ? aData : bData
      if (other) {
        if (other.entityId !== Projectile.owner[id]) {
          console.log('We hit someone!', other)
          if (!actionStatuses[other.entityId]) actionStatuses[other.entityId] = []
          actionStatuses[other.entityId].push(Projectile.actionIdOnHit[id])
        }
      }
    }
  )
  sprite.setMass(1)
  sprite.setSensor(true)
  sprite.setScale(0.5, 0.5)
  sprite.setCollisionCategory(CollisionGroups.Projectiles)
  sprite.setCollidesWith([CollisionGroups.MovableEntities])
  return sprite
}

export function createEntitySprite(
  matter: Phaser.Physics.Matter.MatterPhysics,
  id: number,
  x: number,
  y: number
) {
  const sprite = matter.add.sprite(x, y, getTexture(id))
  sprite.type = 'entity'
  sprite.setData({
    entityId: id,
    isEntity: true,
    isProjectile: false,
    isPlayer: false
  })
  sprite.setMass(1)
  sprite.setVelocity(0, 0)
  sprite.setOnCollide(
    ({
      bodyA,
      bodyB
    }: {
      bodyA: MatterJS.BodyType
      bodyB: MatterJS.BodyType
    }) => {
      if (isBodyGround(bodyA) || isBodyGround(bodyB)) {
        Velocity.onGround[id] = 1
        Velocity.y[id] = 0
        sprite.setVelocity(Velocity.x[id], 0)
      }
    }
  )
  sprite.setOnCollideEnd((e: any) => {
    if (isBodyGround(e.bodyA) || isBodyGround(e.bodyB)) {
      Velocity.onGround[id] = 0
    }
  })
  matter.body.scale(sprite.body as MatterJS.BodyType, 1, 0.25)
  sprite.setOrigin(0.5, 0.925)
  sprite.setMass(1)
  sprite.setCollisionGroup(CollisionGroups.MovableEntities)
  sprite.setCollisionCategory(CollisionGroups.MovableEntities)
  sprite.setCollidesWith([
    CollisionGroups.Floors,
    CollisionGroups.Platforms,
    CollisionGroups.Projectiles
  ])
  sprite.setBounce(0)
  return sprite
}

export function syncMatterSprite(
  id: number,
  sprite: Phaser.Physics.Matter.Sprite
) {
  // turns the entity left or right based on npc direction or player movement
  sprite.setScale(MatterSprite.facing[id] === 0 ? -1 : 1, 1)
}
