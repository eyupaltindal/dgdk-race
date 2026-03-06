import type { Horse } from '@/types/horse.types'
import type { Schedule, Round } from '@/types/schedule.types'
import {
  SURFACES,
  ROUND_DISTANCES,
  TOTAL_ROUNDS,
  HORSES_PER_RACE,
} from '@/constants/race.constants'
import type { Surface } from '@/types/race.types'
import { randomInt, pickRandom } from '@/utils/random.utils'

export function useScheduleGenerator() {
  function selectEligibleHorses(horses: Horse[], roundIndex: number): Horse[] {
    return horses.filter((h) => {
      if (h.consecutiveRaces >= 2) return false
      if (h.lastRacedRound === roundIndex - 1) return false
      return true
    })
  }

  function generateSchedule(horses: Horse[]): Schedule {
    const rounds: Round[] = []

    // We need to generate all 6 rounds upfront using the INITIAL horse state
    // (consecutiveRaces and lastRacedRound at time of schedule creation)
    // The eligibility is based on accumulated state across rounds in the schedule
    const horseState = horses.map((h) => ({ ...h }))

    for (let i = 0; i < TOTAL_ROUNDS; i++) {
      const roundNumber = i + 1
      const distance = ROUND_DISTANCES[roundNumber] as number
      const surface = SURFACES[randomInt(0, SURFACES.length - 1)] as Surface

      const eligible = selectEligibleHorsesFromState(horseState, i)
      const selected = pickRandom(eligible, HORSES_PER_RACE)
      const horseIds = selected.map((h) => h.id)

      // Update simulated state for next round eligibility calculation
      for (const h of horseState) {
        const raced = horseIds.includes(h.id)
        if (raced) {
          h.consecutiveRaces = h.consecutiveRaces + 1
          h.lastRacedRound = i
        } else {
          h.consecutiveRaces = 0
        }
      }

      rounds.push({
        id: `round-${roundNumber}`,
        roundNumber,
        distance,
        surface,
        horseIds,
        result: null,
        status: 'pending',
      })
    }

    return {
      id: `schedule-${Date.now()}`,
      createdAt: Date.now(),
      rounds,
      status: 'pending',
      currentRoundIndex: 0,
    }
  }

  function selectEligibleHorsesFromState(horses: Horse[], roundIndex: number): Horse[] {
    return horses.filter((h) => {
      if (h.consecutiveRaces >= 2) return false
      if (h.lastRacedRound === roundIndex - 1) return false
      return true
    })
  }

  return { generateSchedule, selectEligibleHorses }
}
