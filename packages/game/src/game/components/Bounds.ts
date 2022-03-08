import { defineComponent, Types } from 'bitecs'

export const Bounds = defineComponent({
  x: Types.f32,
  y: Types.f32,
  width: Types.f32,
  height: Types.f32,
  originX: Types.f32,
  originY: Types.f32
})
