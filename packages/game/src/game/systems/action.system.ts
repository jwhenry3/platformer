import { Changed, defineQuery, IWorld } from 'bitecs'
import {
  Action,
  ActionStatus,
  actionStatuses,
  currentActionTick
} from '../components/Action'
export function applyAction(entityId: number, actionId: number) {}
export function applyActions(id: number) {
  actionStatuses[id] = actionStatuses[id] || []
  for (let i = 0; i < Object.keys(actionStatuses[id]).length; i++) {
    const action = actionStatuses[id][i] as number
    // should be any actions that need to apply to the player
    if (
      Action.duration[action] > 0 &&
      (currentActionTick[action][id] || 0) < Action.duration[action]
    ) {
      // apply and leave in list
      console.log('apply status')
      applyAction(id, action)
    } else {
      // apply once and remove

      // applying the action
      console.log('apply last status')
      applyAction(id, action)

      console.log('remove action')
      actionStatuses[id].splice(i, 1)
    }
  }
}

export function createActionSystem() {
  const actionQuery = defineQuery([ActionStatus])
  return (world: IWorld) => {
    actionQuery(world).forEach((id) => {
      applyActions(id)
    })
    return world
  }
}
