import { defineQuery, IWorld } from 'bitecs'
import { Input } from '../components/Input'
import { PlayerTag } from '../components/Player'

export function createPlayerSystem(
  cursors: Phaser.Types.Input.Keyboard.CursorKeys,
  jumpDelay = 50
) {
  const query = defineQuery([PlayerTag, Input])
  return (world: IWorld) => {
    query(world).forEach((id) => {
      Input.up[id] = Number(cursors.up.isDown)
      Input.down[id] = Number(cursors.down.isDown)
      Input.left[id] = Number(cursors.left.isDown)
      Input.right[id] = Number(cursors.right.isDown)
      if (Input.jumpTimer[id] > 0) {
        Input.jumpTimer[id] -= 1
      }
      Input.jump[id] = Number(cursors.space.isDown && !Input.jumpTimer[id])

      if (Input.jump[id]) Input.jumpTimer[id] = jumpDelay
    })
    return world
  }
}
