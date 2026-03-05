import { defineStore } from 'pinia'
import { ref, computed, shallowRef } from 'vue'
import type { RaceHorse } from '../types/race.types'

export const useRaceStore = defineStore('race', () => {
  const countdown = ref<3 | 2 | 1 | 'GO!' | null>(null)
  const horses = shallowRef<RaceHorse[]>([])
  const positions = ref<Record<number, number>>({})
  const raceStartTime = ref<number | null>(null)

  // Getters
  // leaderboard only re-runs when horses finish (shallowRef trigger), not on every position update
  const leaderboard = computed<RaceHorse[]>(() =>
    [...horses.value].sort((a, b) => {
      if (a.finished && b.finished) {
        return (a.finishPosition ?? 0) - (b.finishPosition ?? 0)
      }
      if (a.finished) return -1
      if (b.finished) return 1
      return 0 // running horses order shown via positions ref in template
    }),
  )

  const isAllFinished = computed(
    () => horses.value.length > 0 && horses.value.every((h) => h.finished),
  )

  // Actions
  function initRaceHorses(horseIds: number[]): void {
    horses.value = horseIds.map((id) => ({
      horseId: id,
      finished: false,
      finishTime: null,
      finishPosition: null,
    }))
    positions.value = Object.fromEntries(horseIds.map((id) => [id, 0]))
    raceStartTime.value = null
  }

  function setRaceStartTime(time: number): void {
    raceStartTime.value = time
  }

  function updatePosition(horseId: number, delta: number): void {
    const pos = positions.value[horseId] ?? 0
    if (pos < 100) {
      positions.value[horseId] = Math.min(pos + delta, 100)
    }
  }

  function setFinished(horseId: number, finishTime: number, finishPosition: number): void {
    const horse = horses.value.find((h) => h.horseId === horseId)
    if (horse) {
      horse.finished = true
      horse.finishTime = finishTime
      horse.finishPosition = finishPosition
    }
    positions.value[horseId] = 100
    horses.value = [...horses.value] // trigger shallowRef watchers (leaderboard, isAllFinished)
  }

  function setCountdown(value: 3 | 2 | 1 | 'GO!' | null): void {
    countdown.value = value
  }

  function reset(): void {
    countdown.value = null
    horses.value = []
    positions.value = {}
    raceStartTime.value = null
  }

  return {
    countdown,
    horses,
    positions,
    raceStartTime,
    leaderboard,
    isAllFinished,
    initRaceHorses,
    setRaceStartTime,
    updatePosition,
    setFinished,
    setCountdown,
    reset,
  }
})
