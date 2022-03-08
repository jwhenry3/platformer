import { defineQuery, IWorld } from 'bitecs'
import { Force, setMatterForce } from '../components/Force'
import { Input } from '../components/Input'
import { setMatterVelocity, Velocity } from '../components/Velocity'

export function createSteeringSystem(speed: number = 1) {
  const query = defineQuery([Input, Velocity])
  return (world: IWorld) => {
    query(world).forEach((id) => {
      setMatterVelocity(id, (-Input.left[id] + Input.right[id]) * speed)
      setMatterForce(id, undefined, -Input.jumpTimer[id] * 0.001)
    })
    return world
  }
}
