import { defineQuery, enterQuery, hasComponent, IWorld } from 'bitecs'
import { Input } from '../components/Input'
import { MatterSprite } from '../components/MatterSprite'
import { PlayerTag } from '../components/tags'
import { Velocity } from '../components/Velocity'
import { getSprite } from './matter.system'

export function createPlayerSystem(
  cursors: Phaser.Types.Input.Keyboard.CursorKeys,
  actionKeys: Record<string, Phaser.Input.Keyboard.Key>
) {
  const query = defineQuery([PlayerTag, Input])
  const playerEnter = enterQuery(defineQuery([PlayerTag]))
  return (world: IWorld) => {
    playerEnter(world).forEach((id) => {
      getSprite(id, (sprite) => {
        sprite.setData({
          entityId: id,
          isEntity: true,
          isProjectile: false,
          isPlayer: true,
          isLocalPlayer: hasComponent(world, Input, id)
        })
      })
    })
    query(world).forEach((id) => {
      Input.up[id] = Number(cursors.up.isDown)
      Input.down[id] = Number(cursors.down.isDown)
      Input.left[id] = Number(cursors.left.isDown)
      Input.right[id] = Number(cursors.right.isDown)
      Input.dash[id] = 0
      Input.shoot[id] = Number(actionKeys['A'].isDown)
      if (Input.actionDelay[id] > 0) Input.actionDelay[id]--
      if (Input.jumpTimer[id] > 0) {
        Input.jumpTimer[id]--
        if (Input.jumpTimer[id] === 0) Input.jumpingDown[id] = 0
      }
      if (Velocity.onGround[id]) {
        Input.dashing[id] = 0
        Input.dashingUp[id] = 0
      }
      if (actionKeys['X'].isDown && Velocity.onGround[id]) {
        if (Input.actionDelay[id] === 0) {
          Input.actionDelay[id] = Input.actionDelayAmount[id]
          Input.jump[id] = 1
          Input.jumpTimer[id] = 10
          if (Input.down[id]) {
            Input.jumpingDown[id] = 1
          }
        }
      } else {
        Input.jump[id] = 0
        // add skill modifiers that decide if these movements are allowed
        if (
          actionKeys['X'].isDown &&
          !Input.dashing[id] &&
          !Input.jumpTimer[id]
        ) {
          if (Input.actionDelay[id] === 0) {
            Input.actionDelay[id] = Input.actionDelayAmount[id]
            Input.dash[id] = 1
            Input.dashing[id] = 1
            if (Input.up[id]) Input.dashingUp[id] = 1
          }
        }
      }
    })
    return world
  }
}
