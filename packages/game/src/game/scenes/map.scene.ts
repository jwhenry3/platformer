import { createWorld, IWorld, pipe } from 'bitecs'
import Phaser from 'phaser'
import { CollisionGroups } from '../components/MatterSprite'
import { createNpc } from '../factories/npc.entity'
import { createPlatform } from '../factories/platform.entity'
import { createPlayer } from '../factories/player.entity'
import { createActionSystem } from '../systems/action.system'
import {
  createMatterPhysicsSyncSystem,
  createMatterPhysicsSystem,
  createEntityMatterSystem,
  createProjectileMatterSystem
} from '../systems/matter.system'
import { createNpcSystem } from '../systems/npc.system'
import { createPlayerSystem } from '../systems/player.system'
import { createProjectileSystem } from '../systems/projectile.system'
import { createSteeringSystem } from '../systems/steering.system'

export default class MapScene extends Phaser.Scene {
  public world!: IWorld

  protected pipeline!: (world: IWorld) => void
  protected afterPhysicsPipeline!: (world: IWorld) => void
  protected cursors!: Phaser.Types.Input.Keyboard.CursorKeys
  protected actionKeys!: Record<string, Phaser.Input.Keyboard.Key>

  constructor() {
    super('game')
  }
  init() {
    this.cursors = this.input.keyboard.createCursorKeys()
    this.actionKeys = this.input.keyboard.addKeys('A,S,Z,X,Q,W') as any
    const onAfterUpdate = () => {
      if (!this.afterPhysicsPipeline || !this.world) return
      this.afterPhysicsPipeline(this.world)
    }
    this.matter.world.on(
      Phaser.Physics.Matter.Events.AFTER_UPDATE,
      onAfterUpdate
    )
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.matter.world.off(
        Phaser.Physics.Matter.Events.AFTER_UPDATE,
        onAfterUpdate
      )
    })
    console.log(this.matter.world.walls)
  }

  preload() {
    this.load.spritesheet('player', '/assets/run.png', {
      frameWidth: 33,
      frameHeight: 57
    })
    this.load.spritesheet('fireball', '/assets/fireball.png', {
      frameWidth: 64,
      frameHeight: 64
    })
  }

  create() {
    this.anims.create({
      key: 'stand',
      frameRate: 1,
      frames: this.anims.generateFrameNumbers('player', { start: 0, end: 0 }),
      repeat: 0
    })
    this.anims.create({
      key: 'jump',
      frameRate: 1,
      frames: this.anims.generateFrameNumbers('player', { start: 7, end: 7 }),
      repeat: 0
    })
    this.anims.create({
      key: 'run',
      frameRate: 8,

      frames: this.anims.generateFrameNumbers('player', { start: 1, end: 6 }),
      repeat: -1
    })
    this.anims.create({
      key: 'fireball',
      frameRate: 10,
      frames: this.anims.generateFrameNumbers('fireball', { start: 0, end: 7 }),
      repeat: -1
    })
    const world = createWorld()
    this.world = world

    const player = createPlayer(world, true)
    const npc = createNpc(world, 'test')
    this.pipeline = pipe(
      createEntityMatterSystem(this.matter),
      createProjectileMatterSystem(this.matter),
      createProjectileSystem(this.matter),
      createActionSystem(),
      createNpcSystem(),
      createPlayerSystem(this.cursors, this.actionKeys),
      createSteeringSystem(),
      createMatterPhysicsSystem()
    )
    this.afterPhysicsPipeline = pipe(createMatterPhysicsSyncSystem())

    let rect = this.matter.add.rectangle(-10, 300, 20, 600, {
      isStatic: true,
      collisionFilter: { category: CollisionGroups.Floors }
    })
    rect = this.matter.add.rectangle(500, -10, 1020, 20, {
      isStatic: true,
      collisionFilter: { category: CollisionGroups.Floors }
    })
    rect.type = 'ground'
    rect = this.matter.add.rectangle(500, 600, 1020, 20, {
      isStatic: true,
      collisionFilter: { category: CollisionGroups.Floors }
    })
    rect.type = 'ground'
    rect = this.matter.add.rectangle(1010, 300, 20, 600, {
      isStatic: true,
      collisionFilter: { category: CollisionGroups.Floors }
    })

    createPlatform(this.matter, 100, 450, 1000)
    createPlatform(this.matter, 100, 400, 1000)
    createPlatform(this.matter, 100, 350, 1000)
  }

  override update(t: number, dt: number) {
    if (!this.world || !this.pipeline) return
    this.pipeline(this.world)
  }
}
