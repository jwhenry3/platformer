import { defineQuery, IWorld } from 'bitecs'
import { Force, setMatterForce } from '../components/Force'
import { Input } from '../components/Input'
import { MatterSprite } from '../components/MatterSprite'
import { setMatterVelocity, Velocity } from '../components/Velocity'

export function createSteeringSystem(speed: number = 4) {
  const query = defineQuery([Input, Velocity])
  return (world: IWorld) => {
    query(world).forEach((id) => {
      if (Input.left[id] || Input.right[id]) {
        MatterSprite.facing[id] = -Input.left[id] + Input.right[id] + 1
      } else if (Velocity.onGround[id]) {
        MatterSprite.movementDirection[id] = 1
      }
      if ((!Input.dashing[id] && Velocity.onGround[id]) || Input.dash[id])
        MatterSprite.movementDirection[id] = MatterSprite.facing[id]
      if (!Input.down[id])
        setMatterForce(
          id,
          undefined,
          !Input.dash[id]
            ? Input.jump[id] * -0.015 // add jump modifier
            : Input.dashingUp[id]
            ? Input.dash[id] * -0.06 // add skill modifier
            : Input.dash[id] * -0.03 // add skill modifier
        )
      if (Input.down[id]) {
        setMatterForce(id, undefined, Input.jump[id] * 0.002)
      }
      setMatterVelocity(
        id,
        Velocity.onGround[id]
          ? (-Input.left[id] + Input.right[id]) * speed
          : !Input.dashingUp[id] && Input.dashing[id]
          ? (MatterSprite.movementDirection[id] - 1) *
            (Input.dashing[id] ? 3 : 1) *
            speed
          : undefined
      )
    })
    return world
  }
}
