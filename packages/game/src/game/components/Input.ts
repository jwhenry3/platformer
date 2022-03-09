import { defineComponent, Types } from 'bitecs'

export const Input = defineComponent({
  up: Types.ui8,
  down: Types.ui8,
  left: Types.ui8,
  right: Types.ui8,
  jump: Types.ui8,
  jumpTimer: Types.ui8,
  dash: Types.ui8,
  dashing: Types.ui8,
  dashingUp: Types.ui8
})
