import type { Surface } from '../constants/race.constants'

export type HorseStatus = 'idle' | 'racing' | 'resting' | 'forcedRest'

export interface SurfaceModifiers {
  grass: number
  sand: number
  dirt: number
  synthetic: number
}

export interface Horse {
  id: number
  name: string
  color: string
  baseCondition: number
  favoriteSurface: Surface
  surfaceModifiers: SurfaceModifiers
  consecutiveRaces: number
  lastRacedRound: number | null
  status: HorseStatus
}
