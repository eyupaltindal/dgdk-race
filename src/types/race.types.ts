import type { SURFACES } from '@/constants/race.constants'

export interface RaceHorse {
  horseId: number
  finished: boolean
  finishTime: number | null
  finishPosition: number | null
}

export type Surface = (typeof SURFACES)[number]
