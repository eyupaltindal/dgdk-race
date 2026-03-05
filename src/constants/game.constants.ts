// Performance weights
export const BASE_SPEED_WEIGHT = 0.8 // 80% determined by condition
export const LUCK_SPEED_WEIGHT = 0.2 // 20% determined by luck

// Luck factor range (per frame)
export const LUCK_FACTOR_MIN = 0.85
export const LUCK_FACTOR_MAX = 1.15

// Fatigue multipliers
export const FATIGUE_MODIFIERS: Record<number, number> = {
  0: 1.05, // rested, fresh
  1: 1.0, // normal
  2: 0.85, // fatigued, forced rest on 3rd consecutive race
}

// Surface modifier ranges
export const SURFACE_MODIFIER_FAVORITE_MIN = 1.2
export const SURFACE_MODIFIER_FAVORITE_MAX = 1.4
export const SURFACE_MODIFIER_OTHER_MIN = 0.6
export const SURFACE_MODIFIER_OTHER_MAX = 1.1

// Animation speed constant — calculated dynamically based on distance
// maxPerformance = 100 * 1.40 * 1.05 = 147
// baseDuration = (distance / 1200) * MIN_RACE_DURATION_MS
// speedConstant = 100 / (MAX_PERFORMANCE * baseDuration)
//
// Expected finish times (fastest horse):
// Round 1 (1200m) → 10.0s
// Round 2 (1400m) → 11.7s
// Round 3 (1600m) → 13.3s
// Round 4 (1800m) → 15.0s
// Round 5 (2000m) → 16.7s
// Round 6 (2200m) → 18.3s
export const MIN_RACE_DURATION_MS = 10000 // base duration for 1200m (ms)
export const MAX_PERFORMANCE = 147 // 100 * 1.40 * 1.05

// Countdown steps
export const COUNTDOWN_STEPS = [3, 2, 1, 'GO!'] as const
export const COUNTDOWN_INTERVAL = 1000 // ms
