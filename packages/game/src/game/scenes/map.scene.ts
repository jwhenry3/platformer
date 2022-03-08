import { createWorld, IWorld, pipe } from 'bitecs'
import Phaser from 'phaser'
import { CollisionGroups } from '../components/MatterSprite'
import { createNpc } from '../entities/npc.entity'
import { createPlayer } from '../entities/player.entity'
import {
  createMatterPhysicsSyncSystem,
  createMatterPhysicsSystem,
  createMatterSystem
} from '../systems/matter.system'
import { createNpcSystem } from '../systems/npc.system'
import { createPlayerSystem } from '../systems/player.system'
import { createSteeringSystem } from '../systems/steering.system'

export default class MapScene extends Phaser.Scene {
  public world!: IWorld

  protected pipeline!: (world: IWorld) => void
  protected afterPhysicsPipeline!: (world: IWorld) => void
  protected cursors!: Phaser.Types.Input.Keyboard.CursorKeys

  constructor() {
    super('game')
  }
  init() {
    this.cursors = this.input.keyboard.createCursorKeys()
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

  }

  preload() {
    this.load.spritesheet('player', '/assets/run.png', {
      frameWidth: 33,
      frameHeight: 57
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
    const world = createWorld()
    this.world = world
    const player = createPlayer(world, true)
    const npc = createNpc(world, 'test')
    this.pipeline = pipe(
      createMatterSystem(this.matter),
      createNpcSystem(),
      createPlayerSystem(this.cursors),
      createSteeringSystem(),
      createMatterPhysicsSystem()
    )
    this.afterPhysicsPipeline = pipe(createMatterPhysicsSyncSystem())
    const floor = this.matter.add.rectangle(0, 600, 10000, 100, {
      friction: 1,
      isStatic: true
    })
    floor.type = 'ground'
    floor.collisionFilter.category = CollisionGroups.Floors

  }

  override update(t: number, dt: number) {
    if (!this.world || !this.pipeline) return
    this.pipeline(this.world)
  }
}
