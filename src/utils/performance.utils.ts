import type { Horse, Surface, SurfaceModifiers } from '../types/horse.types'
import {
  BASE_SPEED_WEIGHT,
  LUCK_SPEED_WEIGHT,
  LUCK_FACTOR_MIN,
  LUCK_FACTOR_MAX,
  FATIGUE_MODIFIERS,
  SURFACE_MODIFIER_FAVORITE_MIN,
  SURFACE_MODIFIER_FAVORITE_MAX,
  SURFACE_MODIFIER_OTHER_MIN,
  SURFACE_MODIFIER_OTHER_MAX,
} from '../constants/game.constants'
import { SURFACES } from '../constants/race.constants'
import { randomBetween } from './random.utils'

export function calcFatigueModifier(consecutiveRaces: number): number {
  return FATIGUE_MODIFIERS[consecutiveRaces] ?? (FATIGUE_MODIFIERS[2] as number)
}

export function calcFinalPerformance(horse: Horse, surface: Surface): number {
  const surfaceModifier = horse.surfaceModifiers[surface]
  const fatigueModifier = calcFatigueModifier(horse.consecutiveRaces)
  return horse.baseCondition * surfaceModifier * fatigueModifier
}

export function calcInstantSpeed(
  finalPerformance: number,
  deltaTime: number,
  speedConstant: number,
): number {
  const baseSpeed = finalPerformance * BASE_SPEED_WEIGHT
  const luckFactor = randomBetween(LUCK_FACTOR_MIN, LUCK_FACTOR_MAX)
  const luckSpeed = luckFactor * LUCK_SPEED_WEIGHT
  return (baseSpeed + luckSpeed) * deltaTime * speedConstant
}

export function generateSurfaceModifiers(favoriteSurface: Surface): SurfaceModifiers {
  const modifiers = {} as SurfaceModifiers

  for (const surface of SURFACES) {
    if (surface === favoriteSurface) {
      modifiers[surface] = randomBetween(
        SURFACE_MODIFIER_FAVORITE_MIN,
        SURFACE_MODIFIER_FAVORITE_MAX,
      )
    } else {
      modifiers[surface] = randomBetween(SURFACE_MODIFIER_OTHER_MIN, SURFACE_MODIFIER_OTHER_MAX)
    }
  }

  // Ensure no other surface exceeds favorite surface modifier
  const favoriteModifier = modifiers[favoriteSurface]
  for (const surface of SURFACES) {
    if (surface !== favoriteSurface && modifiers[surface] >= favoriteModifier) {
      modifiers[surface] = favoriteModifier - 0.01
    }
  }

  return modifiers
}
