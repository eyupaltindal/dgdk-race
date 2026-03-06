import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import type { Schedule } from '@/types/schedule.types'
import type { Result } from '@/types/result.types'

function makeMockSchedule(): Schedule {
  return {
    id: 'test-schedule-id',
    createdAt: 1000000,
    status: 'pending',
    currentRoundIndex: 0,
    rounds: Array.from({ length: 6 }, (_, i) => ({
      id: `round-${i}`,
      roundNumber: i + 1,
      distance: 1200 + i * 200,
      surface: 'grass' as const,
      horseIds: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      result: null,
      status: 'pending' as const,
    })),
  }
}

vi.mock('../../composables/useScheduleGenerator', () => ({
  useScheduleGenerator: () => ({
    generateSchedule: (): Schedule => makeMockSchedule(),
  }),
}))

import { useScheduleStore } from '@/stores/scheduleStore'

describe('scheduleStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  describe('initial state', () => {
    it('isGenerated is false when schedule is null', () => {
      const store = useScheduleStore()
      expect(store.isGenerated).toBe(false)
    })

    it('currentRound is null when no schedule', () => {
      const store = useScheduleStore()
      expect(store.currentRound).toBeNull()
    })

    it('currentRoundIndex defaults to 0', () => {
      const store = useScheduleStore()
      expect(store.currentRoundIndex).toBe(0)
    })
  })

  describe('generateSchedule', () => {
    it('creates a schedule with 6 rounds', () => {
      const store = useScheduleStore()
      store.generateSchedule([])
      expect(store.isGenerated).toBe(true)
      expect(store.schedule?.rounds).toHaveLength(6)
    })

    it('starts with currentRoundIndex 0', () => {
      const store = useScheduleStore()
      store.generateSchedule([])
      expect(store.currentRoundIndex).toBe(0)
    })
  })

  describe('currentRound getter', () => {
    it('returns the first round when at index 0', () => {
      const store = useScheduleStore()
      store.generateSchedule([])
      expect(store.currentRound?.roundNumber).toBe(1)
      expect(store.currentRound?.distance).toBe(1200)
    })
  })

  describe('isLastRound getter', () => {
    it('returns false on the first round', () => {
      const store = useScheduleStore()
      store.generateSchedule([])
      expect(store.isLastRound).toBe(false)
    })

    it('returns true when on round index 5 (last round)', () => {
      const store = useScheduleStore()
      store.generateSchedule([])
      for (let i = 0; i < 5; i++) {
        store.advanceToNextRound()
      }
      expect(store.isLastRound).toBe(true)
    })
  })

  describe('pendingRounds getter', () => {
    it('returns all 6 rounds initially (all pending)', () => {
      const store = useScheduleStore()
      store.generateSchedule([])
      expect(store.pendingRounds).toHaveLength(6)
    })

    it('excludes finished rounds', () => {
      const store = useScheduleStore()
      store.generateSchedule([])
      const mockResult: Result = {
        roundId: 'round-0',
        roundNumber: 1,
        surface: 'grass',
        distance: 1200,
        finishOrder: [],
        completedAt: Date.now(),
      }
      store.completeCurrentRound(mockResult)
      expect(store.pendingRounds).toHaveLength(5)
    })
  })

  describe('completedRounds getter', () => {
    it('returns empty array when no rounds finished', () => {
      const store = useScheduleStore()
      store.generateSchedule([])
      expect(store.completedRounds).toHaveLength(0)
    })

    it('returns finished rounds only', () => {
      const store = useScheduleStore()
      store.generateSchedule([])
      const mockResult: Result = {
        roundId: 'round-0',
        roundNumber: 1,
        surface: 'grass',
        distance: 1200,
        finishOrder: [],
        completedAt: Date.now(),
      }
      store.completeCurrentRound(mockResult)
      expect(store.completedRounds).toHaveLength(1)
      expect(store.completedRounds[0]?.roundNumber).toBe(1)
    })
  })

  describe('startCurrentRound', () => {
    it('sets current round status to "racing"', () => {
      const store = useScheduleStore()
      store.generateSchedule([])
      store.startCurrentRound()
      expect(store.currentRound?.status).toBe('racing')
    })

    it('sets schedule status to "inProgress"', () => {
      const store = useScheduleStore()
      store.generateSchedule([])
      store.startCurrentRound()
      expect(store.schedule?.status).toBe('inProgress')
    })
  })

  describe('completeCurrentRound', () => {
    it('sets round result', () => {
      const store = useScheduleStore()
      store.generateSchedule([])
      const mockResult: Result = {
        roundId: 'round-0',
        roundNumber: 1,
        surface: 'grass',
        distance: 1200,
        finishOrder: [],
        completedAt: 999999,
      }
      store.completeCurrentRound(mockResult)
      expect(store.schedule?.rounds[0]?.result).toEqual(mockResult)
    })

    it('sets round status to "finished"', () => {
      const store = useScheduleStore()
      store.generateSchedule([])
      const mockResult: Result = {
        roundId: 'round-0',
        roundNumber: 1,
        surface: 'grass',
        distance: 1200,
        finishOrder: [],
        completedAt: Date.now(),
      }
      store.completeCurrentRound(mockResult)
      expect(store.schedule?.rounds[0]?.status).toBe('finished')
    })

    it('does nothing when schedule is null', () => {
      const store = useScheduleStore()
      const mockResult: Result = {
        roundId: 'round-0',
        roundNumber: 1,
        surface: 'grass',
        distance: 1200,
        finishOrder: [],
        completedAt: Date.now(),
      }
      expect(() => store.completeCurrentRound(mockResult)).not.toThrow()
    })
  })

  describe('advanceToNextRound', () => {
    it('increments currentRoundIndex', () => {
      const store = useScheduleStore()
      store.generateSchedule([])
      store.advanceToNextRound()
      expect(store.currentRoundIndex).toBe(1)
    })

    it('sets next round status to "racing"', () => {
      const store = useScheduleStore()
      store.generateSchedule([])
      store.advanceToNextRound()
      expect(store.schedule?.rounds[1]?.status).toBe('racing')
    })

    it('updates currentRound to the new round', () => {
      const store = useScheduleStore()
      store.generateSchedule([])
      store.advanceToNextRound()
      expect(store.currentRound?.roundNumber).toBe(2)
    })

    it('does nothing when schedule is null', () => {
      const store = useScheduleStore()
      expect(() => store.advanceToNextRound()).not.toThrow()
    })
  })

  describe('getRoundByIndex getter', () => {
    it('returns round at given index', () => {
      const store = useScheduleStore()
      store.generateSchedule([])
      expect(store.getRoundByIndex(0)?.roundNumber).toBe(1)
      expect(store.getRoundByIndex(5)?.roundNumber).toBe(6)
    })

    it('returns null for out-of-bounds index', () => {
      const store = useScheduleStore()
      store.generateSchedule([])
      expect(store.getRoundByIndex(99)).toBeNull()
    })

    it('returns null when no schedule', () => {
      const store = useScheduleStore()
      expect(store.getRoundByIndex(0)).toBeNull()
    })
  })

  describe('reset', () => {
    it('sets schedule to null', () => {
      const store = useScheduleStore()
      store.generateSchedule([])
      store.reset()
      expect(store.schedule).toBeNull()
      expect(store.isGenerated).toBe(false)
    })
  })
})
