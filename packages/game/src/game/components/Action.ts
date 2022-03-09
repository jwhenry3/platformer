import { defineComponent, Types } from 'bitecs'

export const currentActionTick: Record<number, Record<number, number>> = {}
export const actionStatuses: Record<number, number[]> = {}
export const ActionStatus = defineComponent({
  // actions: [Types.ui8, 100] // actions will be added, processed, and removed once they are applied and the duration is exceeded or the action is cancelled
})

export const ActionParameters = defineComponent({
  canHitSelf: Types.ui8,
  canHitPlayers: Types.ui8,
  canHitNpcs: Types.ui8,
  actionId: Types.ui32
})

// Damage, Heals, Buffs, Debuffs
// This is what is applied to an entity when a projectile or interactive object touches said entity
// This could slow movement speed while colliding, or cause damage over time, etc
// could be added on collision and removed on exit of collisio... etc
export const Action = defineComponent({
  canBeCancelled: Types.ui8,
  actionsThatCanCancel: [Types.ui32, 100],
  abilityId: Types.ui32, // reference to icon, description, base details like what it affects
  attributeAffected: Types.ui16, // health, mana, stat (attack defense etc)
  potency: Types.f32, // could be a negative amount

  // buff/debuff details
  duration: Types.f32, // if duration > 0 then this is a buff/debuff
  applyEachTick: Types.ui8, // should apply each tick (not a set value until end type of buff) (more like poison or regeneration)
  // currentTick: [Types.ui32, 1000], // if currentTick > duration then remove action effect from entity
  // totalApplied: [Types.f32, 1000], // total amount that has occurred for this action (potency * ticksThatOccurred)
  removeAtEnd: Types.ui8 // undo applied total when buff ends
})

export function applyEffect(entityId: number, effectId: number) {}
