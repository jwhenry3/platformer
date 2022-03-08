import { defineQuery, IWorld } from 'bitecs'
import { Force, setMatterForce } from '../components/Force'
import { Input } from '../components/Input'
import { MatterSprite } from '../components/MatterSprite'
import { setMatterVelocity, Velocity } from '../components/Velocity'

export function createSteeringSystem(speed: number = 4) {
  const query = defineQuery([Input, Velocity])
  return (world: IWorld) => {
    query(world).forEach((id) => {
      if (Input.left[id] || Input.right[id])
        MatterSprite.facing[id] = -Input.left[id] + Input.right[id] + 1
      setMatterVelocity(id, (-Input.left[id] + Input.right[id]) * speed)
      setMatterForce(id, undefined, Input.jump[id] * -0.02)
    })
    return world
  }
}
