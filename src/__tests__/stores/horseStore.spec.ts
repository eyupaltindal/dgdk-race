import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import type { Horse } from '@/types/horse.types'

// Mock useHorseGenerator before importing the store
vi.mock('../../composables/useHorseGenerator', () => ({
  useHorseGenerator: () => ({
    generateHorses: (): Horse[] =>
      Array.from({ length: 20 }, (_, i) => ({
        id: i + 1,
        name: `Horse ${i + 1}`,
        color: '#ff0000',
        baseCondition: 80,
        favoriteSurface: 'grass' as const,
        surfaceModifiers: { grass: 1.3, sand: 0.8, dirt: 0.9, synthetic: 0.7 },
        consecutiveRaces: 0,
        lastRacedRound: null,
        status: 'idle' as const,
      })),
  }),
}))

import { useHorseStore } from '@/stores/horseStore'

describe('horseStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  describe('initial state', () => {
    it('starts with empty horses array', () => {
      const store = useHorseStore()
      expect(store.horses).toHaveLength(0)
    })

    it('starts with gameStatus "idle"', () => {
      const store = useHorseStore()
      expect(store.gameStatus).toBe('idle')
    })

    it('starts with showAbortModal false', () => {
      const store = useHorseStore()
      expect(store.ui.showAbortModal).toBe(false)
    })
  })

  describe('initHorses', () => {
    it('generates 20 horses', () => {
      const store = useHorseStore()
      store.initHorses()
      expect(store.horses).toHaveLength(20)
    })

    it('horses have correct initial fields', () => {
      const store = useHorseStore()
      store.initHorses()
      const first = store.horses[0]!
      expect(first.id).toBe(1)
      expect(first.consecutiveRaces).toBe(0)
      expect(first.lastRacedRound).toBeNull()
      expect(first.status).toBe('idle')
    })
  })

  describe('getHorseById getter', () => {
    it('returns the correct horse by id', () => {
      const store = useHorseStore()
      store.initHorses()
      const horse = store.getHorseById(7)
      expect(horse?.id).toBe(7)
    })

    it('returns undefined for non-existent id', () => {
      const store = useHorseStore()
      store.initHorses()
      expect(store.getHorseById(999)).toBeUndefined()
    })
  })

  describe('eligibleHorses getter', () => {
    it('returns all 20 horses when none are excluded', () => {
      const store = useHorseStore()
      store.initHorses()
      expect(store.eligibleHorses(0)).toHaveLength(20)
    })

    it('excludes horses with consecutiveRaces >= 2', () => {
      const store = useHorseStore()
      store.initHorses()
      store.horses[0]!.consecutiveRaces = 2
      store.horses[1]!.consecutiveRaces = 3
      const eligible = store.eligibleHorses(1)
      expect(eligible.find((h) => h.id === 1)).toBeUndefined()
      expect(eligible.find((h) => h.id === 2)).toBeUndefined()
      expect(eligible).toHaveLength(18)
    })

    it('excludes horses that raced last round (lastRacedRound === roundIndex - 1)', () => {
      const store = useHorseStore()
      store.initHorses()
      store.horses[0]!.lastRacedRound = 0
      const eligible = store.eligibleHorses(1) // roundIndex=1, so lastRacedRound=0 is excluded
      expect(eligible.find((h) => h.id === 1)).toBeUndefined()
    })

    it('includes horses whose lastRacedRound is not the previous round', () => {
      const store = useHorseStore()
      store.initHorses()
      store.horses[0]!.lastRacedRound = 0
      const eligible = store.eligibleHorses(2) // roundIndex=2, lastRacedRound=0 is not excluded
      expect(eligible.find((h) => h.id === 1)).toBeDefined()
    })
  })

  describe('updateHorseStatuses', () => {
    it('increments consecutiveRaces for horses that raced', () => {
      const store = useHorseStore()
      store.initHorses()
      store.updateHorseStatuses([1, 2, 3], 0)
      expect(store.horses.find((h) => h.id === 1)?.consecutiveRaces).toBe(1)
      expect(store.horses.find((h) => h.id === 2)?.consecutiveRaces).toBe(1)
    })

    it('sets status to "resting" after 1 consecutive race', () => {
      const store = useHorseStore()
      store.initHorses()
      store.updateHorseStatuses([1], 0)
      expect(store.horses.find((h) => h.id === 1)?.status).toBe('resting')
    })

    it('sets status to "forcedRest" after 2 consecutive races', () => {
      const store = useHorseStore()
      store.initHorses()
      store.horses[0]!.consecutiveRaces = 1
      store.updateHorseStatuses([1], 0)
      expect(store.horses.find((h) => h.id === 1)?.status).toBe('forcedRest')
      expect(store.horses.find((h) => h.id === 1)?.consecutiveRaces).toBe(2)
    })

    it('sets lastRacedRound for racing horses', () => {
      const store = useHorseStore()
      store.initHorses()
      store.updateHorseStatuses([1], 3)
      expect(store.horses.find((h) => h.id === 1)?.lastRacedRound).toBe(3)
    })

    it('resets consecutiveRaces to 0 for horses that did not race', () => {
      const store = useHorseStore()
      store.initHorses()
      store.horses[0]!.consecutiveRaces = 2
      store.updateHorseStatuses([2, 3], 0)
      expect(store.horses.find((h) => h.id === 1)?.consecutiveRaces).toBe(0)
    })

    it('sets non-racing forced-rest horses status to "idle" after rest', () => {
      const store = useHorseStore()
      store.initHorses()
      store.horses[0]!.consecutiveRaces = 2
      store.updateHorseStatuses([2], 0) // horse 1 does not race, was forced rest
      expect(store.horses.find((h) => h.id === 1)?.status).toBe('idle')
    })
  })

  describe('setHorseStatusesForRacing', () => {
    it('sets status to "racing" for horses in the race', () => {
      const store = useHorseStore()
      store.initHorses()
      store.setHorseStatusesForRacing([1, 2])
      expect(store.horses.find((h) => h.id === 1)?.status).toBe('racing')
      expect(store.horses.find((h) => h.id === 2)?.status).toBe('racing')
    })

    it('sets status to "resting" for horses not in the race (consecutiveRaces < 2)', () => {
      const store = useHorseStore()
      store.initHorses()
      store.setHorseStatusesForRacing([1])
      expect(store.horses.find((h) => h.id === 2)?.status).toBe('resting')
    })

    it('sets status to "forcedRest" for non-racing horses with consecutiveRaces >= 2', () => {
      const store = useHorseStore()
      store.initHorses()
      store.horses[1]!.consecutiveRaces = 2
      store.setHorseStatusesForRacing([1])
      expect(store.horses.find((h) => h.id === 2)?.status).toBe('forcedRest')
    })
  })

  describe('setGameStatus', () => {
    it('updates gameStatus to any valid value', () => {
      const store = useHorseStore()
      store.setGameStatus('racing')
      expect(store.gameStatus).toBe('racing')
      store.setGameStatus('paused')
      expect(store.gameStatus).toBe('paused')
      store.setGameStatus('gameOver')
      expect(store.gameStatus).toBe('gameOver')
    })
  })

  describe('modal actions', () => {
    it('openAbortModal sets showAbortModal to true', () => {
      const store = useHorseStore()
      store.openAbortModal()
      expect(store.ui.showAbortModal).toBe(true)
    })

    it('closeAbortModal sets showAbortModal to false', () => {
      const store = useHorseStore()
      store.openAbortModal()
      store.closeAbortModal()
      expect(store.ui.showAbortModal).toBe(false)
    })

    it('confirmAbort clears horses, resets gameStatus, and closes modal', () => {
      const store = useHorseStore()
      store.initHorses()
      store.setGameStatus('racing')
      store.openAbortModal()
      store.confirmAbort()
      expect(store.horses).toHaveLength(0)
      expect(store.gameStatus).toBe('idle')
      expect(store.ui.showAbortModal).toBe(false)
    })
  })

  describe('setAllHorsesIdle', () => {
    it('sets all horse statuses to "idle"', () => {
      const store = useHorseStore()
      store.initHorses()
      store.setHorseStatusesForRacing([1, 2, 3])
      store.setAllHorsesIdle()
      expect(store.horses.every((h) => h.status === 'idle')).toBe(true)
    })
  })

  describe('reset', () => {
    it('clears horses, resets gameStatus, and resets UI', () => {
      const store = useHorseStore()
      store.initHorses()
      store.setGameStatus('roundResult')
      store.openAbortModal()
      store.reset()
      expect(store.horses).toHaveLength(0)
      expect(store.gameStatus).toBe('idle')
      expect(store.ui.showAbortModal).toBe(false)
    })
  })
})
