import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { RaceHorse } from '../types/race.types'

export const useRaceStore = defineStore('race', () => {
  const animationFrameId = ref<number | null>(null)
  const lastTimestamp = ref<number | null>(null)
  const countdown = ref<3 | 2 | 1 | 'GO!' | null>(null)
  const horses = ref<RaceHorse[]>([])
  const raceStartTime = ref<number | null>(null)

  // Getters
  const leaderboard = computed<RaceHorse[]>(() =>
    [...horses.value].sort((a, b) => {
      // Finished horses ranked by finishPosition
      if (a.finished && b.finished) {
        return (a.finishPosition ?? 0) - (b.finishPosition ?? 0)
      }
      if (a.finished) return -1
      if (b.finished) return 1
      // Running horses ranked by position (descending)
      return b.position - a.position
    }),
  )

  const isAllFinished = computed(() => horses.value.length > 0 && horses.value.every((h) => h.finished))

  const getHorsePosition = computed(() => (horseId: number) => {
    return horses.value.find((h) => h.horseId === horseId)?.position ?? 0
  })

  // Actions
  function initRaceHorses(horseIds: number[]): void {
    horses.value = horseIds.map((id) => ({
      horseId: id,
      position: 0,
      finished: false,
      finishTime: null,
      finishPosition: null,
    }))
    raceStartTime.value = null
  }

  function setRaceStartTime(time: number): void {
    raceStartTime.value = time
  }

  function updatePosition(horseId: number, delta: number): void {
    const horse = horses.value.find((h) => h.horseId === horseId)
    if (horse && !horse.finished) {
      horse.position = Math.min(horse.position + delta, 100)
    }
  }

  function setFinished(horseId: number, finishTime: number, finishPosition: number): void {
    const horse = horses.value.find((h) => h.horseId === horseId)
    if (horse) {
      horse.finished = true
      horse.finishTime = finishTime
      horse.finishPosition = finishPosition
      horse.position = 100
    }
  }

  function setCountdown(value: 3 | 2 | 1 | 'GO!' | null): void {
    countdown.value = value
  }

  function setAnimationFrameId(id: number | null): void {
    animationFrameId.value = id
  }

  function setLastTimestamp(ts: number | null): void {
    lastTimestamp.value = ts
  }

  function reset(): void {
    if (animationFrameId.value !== null) {
      cancelAnimationFrame(animationFrameId.value)
    }
    animationFrameId.value = null
    lastTimestamp.value = null
    countdown.value = null
    horses.value = []
    raceStartTime.value = null
  }

  return {
    animationFrameId,
    lastTimestamp,
    countdown,
    horses,
    raceStartTime,
    leaderboard,
    isAllFinished,
    getHorsePosition,
    initRaceHorses,
    setRaceStartTime,
    updatePosition,
    setFinished,
    setCountdown,
    setAnimationFrameId,
    setLastTimestamp,
    reset,
  }
})
