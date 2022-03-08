import {
  addComponent,
  addEntity,
  createWorld,
  defineComponent,
  defineQuery,
  defineSystem,
  enterQuery,
  exitQuery,
  IWorld,
  pipe,
  System,
  Types
} from 'bitecs'
import Phaser from 'phaser'
import { createPlayer } from '../entities/player.entity'
import {
  createMatterPhysicsSyncSystem,
  createMatterPhysicsSystem,
  createMatterSystem
} from '../systems/matter.system'
import { createPlayerSystem } from '../systems/player.system'
import { createSpriteSystem } from '../systems/sprite.system'
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
    this.load.image('player', '/assets/stand.png')
  }

  create() {
    const world = createWorld()
    this.world = world
    const player = createPlayer(world, true)
    this.pipeline = pipe(
      createMatterSystem(this.matter),
      createPlayerSystem(this.cursors),
      createSteeringSystem(),
      createMatterPhysicsSystem()
    )
    this.afterPhysicsPipeline = pipe(createMatterPhysicsSyncSystem())
  }

  override update(t: number, dt: number) {
    if (!this.world || !this.pipeline) return
    this.pipeline(this.world)
  }
}
