import { describe, it, expect, vi, afterEach } from 'vitest'
import { randomBetween, randomInt, shuffle, pickRandom } from '@/utils/random.utils'

describe('random.utils', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('randomBetween', () => {
    it('returns a float within [min, max)', () => {
      for (let i = 0; i < 50; i++) {
        const val = randomBetween(5, 10)
        expect(val).toBeGreaterThanOrEqual(5)
        expect(val).toBeLessThan(10)
      }
    })

    it('scales linearly with Math.random', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.5)
      expect(randomBetween(0, 10)).toBe(5)
    })

    it('returns min when Math.random returns 0', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0)
      expect(randomBetween(3, 7)).toBe(3)
    })
  })

  describe('randomInt', () => {
    it('returns an integer in [min, max] inclusive', () => {
      for (let i = 0; i < 100; i++) {
        const val = randomInt(1, 5)
        expect(val).toBeGreaterThanOrEqual(1)
        expect(val).toBeLessThanOrEqual(5)
        expect(Number.isInteger(val)).toBe(true)
      }
    })

    it('covers entire range over many samples', () => {
      const seen = new Set<number>()
      for (let i = 0; i < 1000; i++) {
        seen.add(randomInt(1, 5))
      }
      expect(seen.size).toBe(5)
    })

    it('returns min when Math.random returns 0', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0)
      expect(randomInt(3, 7)).toBe(3)
    })

    it('returns max when Math.random returns close to 1', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.9999)
      expect(randomInt(3, 7)).toBe(7)
    })
  })

  describe('shuffle', () => {
    it('returns an array with the same elements', () => {
      const arr = [1, 2, 3, 4, 5]
      const result = shuffle(arr)
      expect([...result].sort((a, b) => a - b)).toEqual([1, 2, 3, 4, 5])
    })

    it('preserves array length', () => {
      expect(shuffle([1, 2, 3]).length).toBe(3)
    })

    it('does not mutate the original array', () => {
      const arr = [1, 2, 3, 4, 5]
      shuffle(arr)
      expect(arr).toEqual([1, 2, 3, 4, 5])
    })

    it('returns a new array reference', () => {
      const arr = [1, 2, 3]
      expect(shuffle(arr)).not.toBe(arr)
    })

    it('handles empty array', () => {
      expect(shuffle([])).toEqual([])
    })

    it('handles single element array', () => {
      expect(shuffle([42])).toEqual([42])
    })
  })

  describe('pickRandom', () => {
    it('returns exactly count elements', () => {
      const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
      expect(pickRandom(arr, 3).length).toBe(3)
    })

    it('all returned elements come from original array', () => {
      const arr = [10, 20, 30, 40, 50]
      const picked = pickRandom(arr, 3)
      picked.forEach((el) => expect(arr).toContain(el))
    })

    it('returns no duplicates when picking full array', () => {
      const arr = [1, 2, 3, 4, 5]
      const picked = pickRandom(arr, 5)
      expect(new Set(picked).size).toBe(5)
    })

    it('does not mutate the original array', () => {
      const arr = [1, 2, 3, 4, 5]
      pickRandom(arr, 3)
      expect(arr).toEqual([1, 2, 3, 4, 5])
    })
  })
})
