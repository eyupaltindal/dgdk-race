import { describe, it, expect, vi, afterEach } from 'vitest'
import {
  calcFatigueModifier,
  calcFinalPerformance,
  calcInstantSpeed,
  generateSurfaceModifiers,
} from '../../utils/performance.utils'
import type { Horse } from '../../types/horse.types'
import { SURFACES } from '../../constants/race.constants'

describe('performance.utils', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('calcFatigueModifier', () => {
    it('returns 1.05 for 0 consecutive races (rested)', () => {
      expect(calcFatigueModifier(0)).toBe(1.05)
    })

    it('returns 1.0 for 1 consecutive race (normal)', () => {
      expect(calcFatigueModifier(1)).toBe(1.0)
    })

    it('returns 0.85 for 2 consecutive races (fatigued)', () => {
      expect(calcFatigueModifier(2)).toBe(0.85)
    })

    it('returns 0.85 as fallback for values > 2', () => {
      expect(calcFatigueModifier(3)).toBe(0.85)
      expect(calcFatigueModifier(99)).toBe(0.85)
    })
  })

  describe('calcFinalPerformance', () => {
    const horse: Horse = {
      id: 1,
      name: 'Test',
      color: '#ff0000',
      baseCondition: 100,
      favoriteSurface: 'grass',
      surfaceModifiers: { grass: 1.3, sand: 0.8, dirt: 0.9, synthetic: 0.7 },
      consecutiveRaces: 0,
      lastRacedRound: null,
      status: 'idle',
    }

    it('multiplies baseCondition × surfaceModifier × fatigueModifier', () => {
      // consecutiveRaces=0 → fatigueModifier=1.05
      // surface=grass → surfaceModifier=1.3
      // expected = 100 * 1.3 * 1.05 = 136.5
      expect(calcFinalPerformance(horse, 'grass')).toBeCloseTo(136.5, 5)
    })

    it('applies the correct surface modifier', () => {
      // 100 * 0.8 * 1.05 = 84
      expect(calcFinalPerformance(horse, 'sand')).toBeCloseTo(84, 5)
    })

    it('applies fatigue correctly for 2 consecutive races', () => {
      const fatiguedHorse: Horse = { ...horse, consecutiveRaces: 2 }
      // 100 * 1.3 * 0.85 = 110.5
      expect(calcFinalPerformance(fatiguedHorse, 'grass')).toBeCloseTo(110.5, 5)
    })

    it('gives higher performance on favorite surface vs non-favorite', () => {
      const perf_grass = calcFinalPerformance(horse, 'grass')
      const perf_sand = calcFinalPerformance(horse, 'sand')
      expect(perf_grass).toBeGreaterThan(perf_sand)
    })
  })

  describe('calcInstantSpeed', () => {
    it('calculates speed using (baseSpeed + luckSpeed) * deltaTime * speedConstant', () => {
      // Math.random = 0.5 → luckFactor = 0.85 + 0.5 * (1.15 - 0.85) = 0.85 + 0.15 = 1.0
      // baseSpeed = 100 * 0.8 = 80
      // luckSpeed = 1.0 * 0.2 = 0.2
      // speed = (80 + 0.2) * 16 * 0.001 = 1.2832
      vi.spyOn(Math, 'random').mockReturnValue(0.5)
      const result = calcInstantSpeed(100, 16, 0.001)
      expect(result).toBeCloseTo(1.2832, 4)
    })

    it('returns higher speed with higher finalPerformance', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.5)
      const slow = calcInstantSpeed(50, 16, 0.001)
      vi.spyOn(Math, 'random').mockReturnValue(0.5)
      const fast = calcInstantSpeed(100, 16, 0.001)
      expect(fast).toBeGreaterThan(slow)
    })

    it('returns 0 speed when deltaTime is 0', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.5)
      expect(calcInstantSpeed(100, 0, 0.001)).toBe(0)
    })
  })

  describe('generateSurfaceModifiers', () => {
    it('returns modifiers for all 4 surfaces', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.5)
      const modifiers = generateSurfaceModifiers('grass')
      for (const surface of SURFACES) {
        expect(typeof modifiers[surface]).toBe('number')
      }
    })

    it('favorite surface has the highest modifier', () => {
      // Math.random=0.5 → favorite=1.2+0.5*0.2=1.3, others=0.6+0.5*0.5=0.85
      vi.spyOn(Math, 'random').mockReturnValue(0.5)
      const modifiers = generateSurfaceModifiers('grass')
      const favoriteVal = modifiers['grass']
      for (const surface of SURFACES) {
        if (surface !== 'grass') {
          expect(favoriteVal).toBeGreaterThan(modifiers[surface])
        }
      }
    })

    it('favorite surface modifier is within [1.2, 1.4]', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.5)
      const modifiers = generateSurfaceModifiers('sand')
      expect(modifiers['sand']).toBeGreaterThanOrEqual(1.2)
      expect(modifiers['sand']).toBeLessThanOrEqual(1.4)
    })

    it('non-favorite surface modifiers are strictly below favorite', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.5)
      const modifiers = generateSurfaceModifiers('dirt')
      const favoriteVal = modifiers['dirt']
      for (const surface of SURFACES) {
        if (surface !== 'dirt') {
          expect(modifiers[surface]).toBeLessThan(favoriteVal)
        }
      }
    })

    it('works for each surface as favorite', () => {
      for (const fav of SURFACES) {
        vi.spyOn(Math, 'random').mockReturnValue(0.5)
        const modifiers = generateSurfaceModifiers(fav)
        const favoriteVal = modifiers[fav]
        for (const surface of SURFACES) {
          if (surface !== fav) {
            expect(favoriteVal).toBeGreaterThan(modifiers[surface])
          }
        }
        vi.restoreAllMocks()
      }
    })
  })
})
