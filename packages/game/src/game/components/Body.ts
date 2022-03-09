import { defineComponent, Types } from 'bitecs'

export const Body = defineComponent({
  isSensor: Types.ui8,
  isStatic: Types.ui8,
  fallingThroughPlatform: Types.ui8
})
