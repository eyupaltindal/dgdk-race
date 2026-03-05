import type { Surface } from '../types/horse.types'

export const ROUND_DISTANCES: Record<number, number> = {
  1: 1200,
  2: 1400,
  3: 1600,
  4: 1800,
  5: 2000,
  6: 2200,
}

export const SURFACES: Surface[] = ['grass', 'sand', 'dirt', 'synthetic']

export const TOTAL_HORSES = 20
export const HORSES_PER_RACE = 10
export const TOTAL_ROUNDS = 6
export const ROUND_RESULT_DISPLAY_DURATION = 3000 // ms
