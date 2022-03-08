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
      if (cursors.space.isDown && Velocity.onGround[id]) {
        Input.jump[id] = 1
      } else {
        Input.jump[id] = 0
      }
    })
    return world
  }
}
