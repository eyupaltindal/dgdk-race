import { useRaceStore } from '@/stores/raceStore'
import { COUNTDOWN_STEPS, COUNTDOWN_INTERVAL } from '@/constants/game.constants'

export function useCountdown() {
  function runCountdown(): Promise<void> {
    const raceStore = useRaceStore()

    return new Promise((resolve) => {
      let index = 0

      function step() {
        if (index >= COUNTDOWN_STEPS.length) {
          raceStore.setCountdown(null)
          resolve()
          return
        }

        raceStore.setCountdown(COUNTDOWN_STEPS[index] as 3 | 2 | 1 | 'GO!')
        index++
        setTimeout(step, COUNTDOWN_INTERVAL)
      }

      step()
    })
  }

  return { runCountdown }
}
