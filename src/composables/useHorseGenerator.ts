import type { Horse, Surface } from '../types/horse.types'
import { HORSE_NAMES, HORSE_COLORS } from '../constants/horse.constants'
import { SURFACES, TOTAL_HORSES } from '../constants/race.constants'
import { randomInt } from '../utils/random.utils'
import { generateSurfaceModifiers } from '../utils/performance.utils'

export function useHorseGenerator() {
  function generateHorses(): Horse[] {
    const horses: Horse[] = []

    for (let i = 0; i < TOTAL_HORSES; i++) {
      const favoriteSurface = SURFACES[randomInt(0, SURFACES.length - 1)] as Surface
      const baseCondition = randomInt(70, 100)

      horses.push({
        id: i + 1,
        name: HORSE_NAMES[i] as string,
        color: HORSE_COLORS[i] as string,
        baseCondition,
        favoriteSurface,
        surfaceModifiers: generateSurfaceModifiers(favoriteSurface),
        consecutiveRaces: 0,
        lastRacedRound: null,
        status: 'idle',
      })
    }

    return horses
  }

  return { generateHorses }
}
