import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Horse, HorseStatus } from '@/types/horse.types'
import type { GameStatus } from '@/types/game.types'
import { useHorseGenerator } from '@/composables/useHorseGenerator'

export const useHorseStore = defineStore('horse', () => {
  const horses = ref<Horse[]>([])
  const gameStatus = ref<GameStatus>('idle')
  const ui = ref({ showAbortModal: false })

  // Getters
  const horseMap = computed(() => new Map(horses.value.map((h) => [h.id, h])))

  const getHorseById = computed(() => (id: number) => horseMap.value.get(id))

  const eligibleHorses = computed(
    () => (roundIndex: number) =>
      horses.value.filter((h) => {
        if (h.consecutiveRaces >= 2) return false
        if (h.lastRacedRound === roundIndex - 1) return false
        return true
      }),
  )

  // Actions
  function initHorses(): void {
    const { generateHorses } = useHorseGenerator()
    horses.value = generateHorses()
  }

  function updateHorseStatuses(roundHorseIds: number[], roundIndex: number): void {
    for (const horse of horses.value) {
      const raced = roundHorseIds.includes(horse.id)
      if (raced) {
        const newConsecutive = horse.consecutiveRaces + 1
        horse.consecutiveRaces = newConsecutive
        horse.lastRacedRound = roundIndex
        horse.status = (newConsecutive >= 2 ? 'forcedRest' : 'resting') as HorseStatus
      } else {
        const wasForced = horse.consecutiveRaces >= 2
        horse.consecutiveRaces = 0
        horse.status = (wasForced ? 'idle' : 'resting') as HorseStatus
      }
    }
  }

  function setHorseStatusesForRacing(roundHorseIds: number[]): void {
    for (const horse of horses.value) {
      horse.status = roundHorseIds.includes(horse.id)
        ? ('racing' as HorseStatus)
        : horse.consecutiveRaces >= 2
          ? ('forcedRest' as HorseStatus)
          : ('resting' as HorseStatus)
    }
  }

  function setGameStatus(status: GameStatus): void {
    gameStatus.value = status
  }

  function openAbortModal(): void {
    ui.value.showAbortModal = true
  }

  function closeAbortModal(): void {
    ui.value.showAbortModal = false
  }

  function confirmAbort(): void {
    ui.value.showAbortModal = false
    horses.value = []
    gameStatus.value = 'idle'
  }

  function setAllHorsesIdle(): void {
    for (const horse of horses.value) {
      horse.status = 'idle' as HorseStatus
    }
  }

  function reset(): void {
    horses.value = []
    gameStatus.value = 'idle'
    ui.value = { showAbortModal: false }
  }

  return {
    horses,
    gameStatus,
    ui,
    getHorseById,
    eligibleHorses,
    initHorses,
    updateHorseStatuses,
    setHorseStatusesForRacing,
    setAllHorsesIdle,
    setGameStatus,
    openAbortModal,
    closeAbortModal,
    confirmAbort,
    reset,
  }
})
