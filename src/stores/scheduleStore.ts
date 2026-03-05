import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Schedule, Round } from '../types/schedule.types'
import type { Result } from '../types/result.types'
import type { Horse } from '../types/horse.types'
import { useScheduleGenerator } from '../composables/useScheduleGenerator'

export const useScheduleStore = defineStore('schedule', () => {
  const schedule = ref<Schedule | null>(null)

  // Getters
  const isGenerated = computed(() => schedule.value !== null)

  const currentRoundIndex = computed(() => schedule.value?.currentRoundIndex ?? 0)

  const currentRound = computed<Round | null>(
    () => schedule.value?.rounds[schedule.value.currentRoundIndex] ?? null,
  )

  const isLastRound = computed(() => schedule.value?.currentRoundIndex === 5)

  const completedRounds = computed<Round[]>(
    () => schedule.value?.rounds.filter((r) => r.status === 'finished') ?? [],
  )

  const pendingRounds = computed<Round[]>(
    () => schedule.value?.rounds.filter((r) => r.status === 'pending') ?? [],
  )

  const getRoundByIndex = computed(() => (index: number): Round | null => {
    return schedule.value?.rounds[index] ?? null
  })

  // Actions
  function generateSchedule(horses: Horse[]): void {
    const { generateSchedule: gen } = useScheduleGenerator()
    schedule.value = gen(horses)
  }

  function completeCurrentRound(result: Result): void {
    if (!schedule.value) return
    const idx = schedule.value.currentRoundIndex
    const round = schedule.value.rounds[idx]
    if (round) {
      round.result = result
      round.status = 'finished'
    }
  }

  function advanceToNextRound(): void {
    if (!schedule.value) return
    const next = schedule.value.currentRoundIndex + 1
    if (next < schedule.value.rounds.length) {
      schedule.value.currentRoundIndex = next
      const nextRound = schedule.value.rounds[next]
      if (nextRound) nextRound.status = 'racing'
    }
  }

  function startCurrentRound(): void {
    if (!schedule.value) return
    const idx = schedule.value.currentRoundIndex
    const round = schedule.value.rounds[idx]
    if (round) round.status = 'racing'
    schedule.value.status = 'inProgress'
  }

  function reset(): void {
    schedule.value = null
  }

  return {
    schedule,
    isGenerated,
    currentRound,
    currentRoundIndex,
    getRoundByIndex,
    isLastRound,
    completedRounds,
    pendingRounds,
    generateSchedule,
    completeCurrentRound,
    advanceToNextRound,
    startCurrentRound,
    reset,
  }
})
