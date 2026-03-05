import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Horse, HorseStatus } from '../types/horse.types'
import type { GameStatus } from '../types/game.types'
import { useHorseGenerator } from '../composables/useHorseGenerator'

export const useHorseStore = defineStore('horse', () => {
  const horses = ref<Horse[]>([])
  const gameStatus = ref<GameStatus>('idle')
  const ui = ref({ showAbortModal: false })

  // Getters
  const getHorseById = computed(() => (id: number) => horses.value.find((h) => h.id === id))

  const eligibleHorses = computed(() => (roundIndex: number) =>
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
    horses.value = horses.value.map((horse) => {
      const raced = roundHorseIds.includes(horse.id)

      if (raced) {
        const newConsecutive = horse.consecutiveRaces + 1
        return {
          ...horse,
          consecutiveRaces: newConsecutive,
          lastRacedRound: roundIndex,
          status: (newConsecutive >= 2 ? 'forcedRest' : 'resting') as HorseStatus,
        }
      } else {
        // Did not race this round
        const wasForced = horse.consecutiveRaces >= 2
        return {
          ...horse,
          consecutiveRaces: 0, // reset after rest
          status: (wasForced ? 'idle' : 'resting') as HorseStatus,
        }
      }
    })
  }

  function setHorseStatusesForRacing(roundHorseIds: number[]): void {
    horses.value = horses.value.map((horse) => {
      const isRacing = roundHorseIds.includes(horse.id)
      if (isRacing) return { ...horse, status: 'racing' as HorseStatus }
      const status: HorseStatus = horse.consecutiveRaces >= 2 ? 'forcedRest' : 'resting'
      return { ...horse, status }
    })
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
    horses.value = horses.value.map((horse) => ({ ...horse, status: 'idle' as HorseStatus }))
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
