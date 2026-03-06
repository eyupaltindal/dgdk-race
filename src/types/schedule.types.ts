import type { Surface } from '@/types/race.types'
import type { Result } from '@/types/result.types'

export type RoundStatus = 'pending' | 'racing' | 'finished'

export interface Round {
  id: string
  roundNumber: number
  distance: number
  surface: Surface
  horseIds: number[]
  result: Result | null
  status: RoundStatus
}

export type ScheduleStatus = 'pending' | 'inProgress' | 'completed'

export interface Schedule {
  id: string
  createdAt: number
  rounds: Round[]
  status: ScheduleStatus
  currentRoundIndex: number
}
