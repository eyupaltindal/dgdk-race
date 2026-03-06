import { useHorseStore } from '@/stores/horseStore'
import { useScheduleStore } from '@/stores/scheduleStore'
import { useRaceStore } from '@/stores/raceStore'
import { useCountdown } from '@/composables/useCountdown'
import type { Surface } from '@/types/race.types'
import type { FinishEntry, Result } from '@/types/result.types'
import { calcFinalPerformance, calcInstantSpeed } from '@/utils/performance.utils'
import { MIN_RACE_DURATION_MS, MAX_PERFORMANCE } from '@/constants/game.constants'
import { ROUND_RESULT_DISPLAY_DURATION } from '@/constants/race.constants'

// Module-level singleton state — shared across all useRaceEngine() calls
let animationFrameId: number | null = null
let lastTimestamp: number | null = null

export function useRaceEngine() {
  const horseStore = useHorseStore()
  const scheduleStore = useScheduleStore()
  const raceStore = useRaceStore()
  const { runCountdown } = useCountdown()

  let speedConstant = 0
  let currentSurface: Surface = 'grass'
  let finishCounter = 0
  let raceElapsedTime = 0

  function stopAnimation(): void {
    if (animationFrameId !== null) {
      cancelAnimationFrame(animationFrameId)
      animationFrameId = null
    }
  }

  async function startRace(): Promise<void> {
    const round = scheduleStore.currentRound
    if (!round) return

    // Initialize race state
    raceStore.initRaceHorses(round.horseIds)
    horseStore.setHorseStatusesForRacing(round.horseIds)
    scheduleStore.startCurrentRound()
    horseStore.setGameStatus('countdown')

    // Compute speed constant for this round
    currentSurface = round.surface
    const baseDuration = (round.distance / 1200) * MIN_RACE_DURATION_MS
    speedConstant = 100 / (MAX_PERFORMANCE * baseDuration)
    finishCounter = 0
    raceElapsedTime = 0

    // Run countdown
    await runCountdown()

    // Start racing
    horseStore.setGameStatus('racing')
    lastTimestamp = null

    const startTs = performance.now()
    raceStore.setRaceStartTime(startTs)
    lastTimestamp = startTs

    animationFrameId = requestAnimationFrame(gameLoop)
  }

  function gameLoop(timestamp: number): void {
    if (horseStore.gameStatus !== 'racing') return

    const deltaTime = lastTimestamp !== null ? timestamp - lastTimestamp : 0
    lastTimestamp = timestamp

    raceElapsedTime += deltaTime

    const round = scheduleStore.currentRound
    if (!round) return

    for (const raceHorse of raceStore.horses) {
      if (raceHorse.finished) continue

      const horse = horseStore.getHorseById(raceHorse.horseId)
      if (!horse) continue

      const finalPerf = calcFinalPerformance(horse, currentSurface)
      const speed = calcInstantSpeed(finalPerf, deltaTime, speedConstant)

      raceStore.updatePosition(raceHorse.horseId, speed)

      if ((raceStore.positions[raceHorse.horseId] ?? 0) >= 100) {
        finishCounter++
        raceStore.setFinished(raceHorse.horseId, raceElapsedTime, finishCounter)
      }
    }

    if (raceStore.isAllFinished) {
      animationFrameId = null
      finishRace()
    } else {
      animationFrameId = requestAnimationFrame(gameLoop)
    }
  }

  function finishRace(): void {
    const round = scheduleStore.currentRound
    if (!round) return

    // Build result
    const finishOrder: FinishEntry[] = raceStore.horses
      .filter((rh) => rh.finishPosition !== null)
      .sort((a, b) => (a.finishPosition ?? 0) - (b.finishPosition ?? 0))
      .map((rh) => {
        const horse = horseStore.getHorseById(rh.horseId)!
        const finalPerf = calcFinalPerformance(horse, currentSurface)
        return {
          position: rh.finishPosition!,
          horseId: rh.horseId,
          horseName: horse.name,
          horseColor: horse.color,
          finishTime: rh.finishTime!,
          performance: Math.round(finalPerf * 100) / 100,
        }
      })

    const result: Result = {
      roundId: round.id,
      roundNumber: round.roundNumber,
      surface: round.surface,
      distance: round.distance,
      finishOrder,
      completedAt: Date.now(),
    }

    scheduleStore.completeCurrentRound(result)
    horseStore.updateHorseStatuses(round.horseIds, scheduleStore.currentRoundIndex)
    horseStore.setGameStatus('roundResult')

    setTimeout(() => {
      if (scheduleStore.isLastRound) {
        scheduleStore.schedule!.status = 'completed'
        horseStore.setAllHorsesIdle()
        horseStore.setGameStatus('gameOver')
      } else {
        scheduleStore.advanceToNextRound()
        raceStore.reset()
        startRace()
      }
    }, ROUND_RESULT_DISPLAY_DURATION)
  }

  function pauseRace(): void {
    stopAnimation()
    horseStore.setGameStatus('paused')
  }

  async function resumeRace(): Promise<void> {
    horseStore.setGameStatus('countdown')
    lastTimestamp = null

    await runCountdown()

    horseStore.setGameStatus('racing')
    lastTimestamp = performance.now()
    animationFrameId = requestAnimationFrame(gameLoop)
  }

  return { startRace, pauseRace, resumeRace, stopAnimation }
}
