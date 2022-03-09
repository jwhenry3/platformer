import { defineQuery, IWorld } from 'bitecs'
import { Input } from '../components/Input'
import { PlayerTag } from '../components/tags'
import { Velocity } from '../components/Velocity'

export function createPlayerSystem(
  cursors: Phaser.Types.Input.Keyboard.CursorKeys
) {
  const query = defineQuery([PlayerTag, Input])
  return (world: IWorld) => {
    query(world).forEach((id) => {
      Input.up[id] = Number(cursors.up.isDown)
      Input.down[id] = Number(cursors.down.isDown)
      Input.left[id] = Number(cursors.left.isDown)
      Input.right[id] = Number(cursors.right.isDown)
      Input.dash[id] = 0
      if (Input.jumpTimer[id] > 0) Input.jumpTimer[id]--
      if (Velocity.onGround[id]) {
        Input.dashing[id] = 0
        Input.dashingUp[id] = 0
      }

      if (cursors.space.isDown && Velocity.onGround[id]) {
        Input.jump[id] = 1
        Input.jumpTimer[id] = 10
      } else {
        Input.jump[id] = 0
        // add skill modifiers that decide if these movements are allowed
        if (
          cursors.space.isDown &&
          !Input.dashing[id] &&
          !Input.jumpTimer[id]
        ) {
          Input.dash[id] = 1
          Input.dashing[id] = 1
          if (Input.up[id]) Input.dashingUp[id] = 1
        }
      }
    })
    return world
  }
}
