export interface FinishEntry {
  position: number
  horseId: number
  horseName: string
  horseColor: string
  finishTime: number
  performance: number
}

export interface Result {
  roundId: string
  roundNumber: number
  surface: string
  distance: number
  finishOrder: FinishEntry[]
  completedAt: number
}
