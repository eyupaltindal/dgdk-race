import { describe, it, expect, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useRaceStore } from '../../stores/raceStore'

describe('raceStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  describe('initRaceHorses', () => {
    it('initializes horses with correct default state', () => {
      const store = useRaceStore()
      store.initRaceHorses([1, 2, 3])
      expect(store.horses).toHaveLength(3)
      expect(store.horses[0]).toMatchObject({
        horseId: 1,
        position: 0,
        finished: false,
        finishTime: null,
        finishPosition: null,
      })
    })

    it('creates a horse entry for each provided id', () => {
      const store = useRaceStore()
      store.initRaceHorses([10, 20, 30])
      const ids = store.horses.map((h) => h.horseId)
      expect(ids).toEqual([10, 20, 30])
    })

    it('resets raceStartTime to null', () => {
      const store = useRaceStore()
      store.setRaceStartTime(9999)
      store.initRaceHorses([1])
      expect(store.raceStartTime).toBeNull()
    })
  })

  describe('updatePosition', () => {
    it('increases horse position by delta', () => {
      const store = useRaceStore()
      store.initRaceHorses([1])
      store.updatePosition(1, 10)
      expect(store.horses[0]?.position).toBe(10)
    })

    it('clamps position at 100', () => {
      const store = useRaceStore()
      store.initRaceHorses([1])
      store.updatePosition(1, 150)
      expect(store.horses[0]?.position).toBe(100)
    })

    it('accumulates multiple deltas', () => {
      const store = useRaceStore()
      store.initRaceHorses([1])
      store.updatePosition(1, 30)
      store.updatePosition(1, 25)
      expect(store.horses[0]?.position).toBe(55)
    })

    it('does not update position of a finished horse', () => {
      const store = useRaceStore()
      store.initRaceHorses([1])
      store.setFinished(1, 10000, 1)
      store.updatePosition(1, 5)
      expect(store.horses[0]?.position).toBe(100)
    })

    it('does not affect other horses', () => {
      const store = useRaceStore()
      store.initRaceHorses([1, 2])
      store.updatePosition(1, 50)
      expect(store.horses[1]?.position).toBe(0)
    })
  })

  describe('setFinished', () => {
    it('marks horse as finished with correct data', () => {
      const store = useRaceStore()
      store.initRaceHorses([1])
      store.setFinished(1, 12500, 1)
      expect(store.horses[0]).toMatchObject({
        finished: true,
        finishTime: 12500,
        finishPosition: 1,
        position: 100,
      })
    })

    it('sets position to 100 regardless of current position', () => {
      const store = useRaceStore()
      store.initRaceHorses([1])
      store.updatePosition(1, 70)
      store.setFinished(1, 12500, 1)
      expect(store.horses[0]?.position).toBe(100)
    })
  })

  describe('setCountdown', () => {
    it('sets countdown to a number', () => {
      const store = useRaceStore()
      store.setCountdown(3)
      expect(store.countdown).toBe(3)
      store.setCountdown(1)
      expect(store.countdown).toBe(1)
    })

    it('sets countdown to "GO!"', () => {
      const store = useRaceStore()
      store.setCountdown('GO!')
      expect(store.countdown).toBe('GO!')
    })

    it('sets countdown to null', () => {
      const store = useRaceStore()
      store.setCountdown(3)
      store.setCountdown(null)
      expect(store.countdown).toBeNull()
    })
  })

  describe('setRaceStartTime', () => {
    it('stores the start time', () => {
      const store = useRaceStore()
      store.setRaceStartTime(123456)
      expect(store.raceStartTime).toBe(123456)
    })
  })

  describe('leaderboard getter', () => {
    it('returns empty array when no horses', () => {
      const store = useRaceStore()
      expect(store.leaderboard).toHaveLength(0)
    })

    it('places finished horses before running horses', () => {
      const store = useRaceStore()
      store.initRaceHorses([1, 2, 3])
      store.updatePosition(1, 90)
      store.updatePosition(2, 50)
      store.setFinished(3, 10000, 1)
      expect(store.leaderboard[0]?.horseId).toBe(3)
    })

    it('ranks finished horses by finishPosition ascending', () => {
      const store = useRaceStore()
      store.initRaceHorses([1, 2, 3])
      store.setFinished(1, 12000, 2)
      store.setFinished(2, 11000, 1)
      store.setFinished(3, 13000, 3)
      const lb = store.leaderboard
      expect(lb[0]?.horseId).toBe(2) // finishPosition 1
      expect(lb[1]?.horseId).toBe(1) // finishPosition 2
      expect(lb[2]?.horseId).toBe(3) // finishPosition 3
    })

    it('ranks running horses by position descending', () => {
      const store = useRaceStore()
      store.initRaceHorses([1, 2, 3])
      store.updatePosition(1, 20)
      store.updatePosition(2, 60)
      store.updatePosition(3, 40)
      const lb = store.leaderboard
      expect(lb[0]?.horseId).toBe(2)
      expect(lb[1]?.horseId).toBe(3)
      expect(lb[2]?.horseId).toBe(1)
    })
  })

  describe('isAllFinished getter', () => {
    it('returns false when horses array is empty', () => {
      const store = useRaceStore()
      expect(store.isAllFinished).toBe(false)
    })

    it('returns false when at least one horse is still running', () => {
      const store = useRaceStore()
      store.initRaceHorses([1, 2])
      store.setFinished(1, 10000, 1)
      expect(store.isAllFinished).toBe(false)
    })

    it('returns true when all horses are finished', () => {
      const store = useRaceStore()
      store.initRaceHorses([1, 2])
      store.setFinished(1, 10000, 1)
      store.setFinished(2, 11000, 2)
      expect(store.isAllFinished).toBe(true)
    })
  })

  describe('getHorsePosition getter', () => {
    it('returns current position of a horse', () => {
      const store = useRaceStore()
      store.initRaceHorses([1])
      store.updatePosition(1, 42)
      expect(store.getHorsePosition(1)).toBe(42)
    })

    it('returns 0 for unknown horse id', () => {
      const store = useRaceStore()
      expect(store.getHorsePosition(999)).toBe(0)
    })
  })

  describe('reset', () => {
    it('clears horses array', () => {
      const store = useRaceStore()
      store.initRaceHorses([1, 2, 3])
      store.reset()
      expect(store.horses).toHaveLength(0)
    })

    it('clears countdown', () => {
      const store = useRaceStore()
      store.setCountdown(3)
      store.reset()
      expect(store.countdown).toBeNull()
    })

    it('clears raceStartTime', () => {
      const store = useRaceStore()
      store.setRaceStartTime(12345)
      store.reset()
      expect(store.raceStartTime).toBeNull()
    })

    it('clears lastTimestamp', () => {
      const store = useRaceStore()
      store.setLastTimestamp(9999)
      store.reset()
      expect(store.lastTimestamp).toBeNull()
    })
  })
})
