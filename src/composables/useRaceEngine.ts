import { useHorseStore } from '../stores/horseStore'
import { useScheduleStore } from '../stores/scheduleStore'
import { useRaceStore } from '../stores/raceStore'
import { useCountdown } from './useCountdown'
import type { Surface } from '../types/horse.types'
import type { FinishEntry, Result } from '../types/result.types'
import { calcFinalPerformance, calcInstantSpeed } from '../utils/performance.utils'
import { MIN_RACE_DURATION_MS, MAX_PERFORMANCE } from '../constants/game.constants'
import { ROUND_RESULT_DISPLAY_DURATION } from '../constants/race.constants'

export function useRaceEngine() {
  const horseStore = useHorseStore()
  const scheduleStore = useScheduleStore()
  const raceStore = useRaceStore()
  const { runCountdown } = useCountdown()

  let speedConstant = 0
  let currentSurface: Surface = 'grass'
  let finishCounter = 0
  let raceElapsedTime = 0

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
    raceStore.setLastTimestamp(null)

    const startTs = performance.now()
    raceStore.setRaceStartTime(startTs)
    raceStore.setLastTimestamp(startTs)

    const frameId = requestAnimationFrame(gameLoop)
    raceStore.setAnimationFrameId(frameId)
  }

  function gameLoop(timestamp: number): void {
    if (horseStore.gameStatus !== 'racing') return

    const lastTs = raceStore.lastTimestamp
    const deltaTime = lastTs !== null ? timestamp - lastTs : 0
    raceStore.setLastTimestamp(timestamp)

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

      if (raceHorse.position >= 100) {
        finishCounter++
        raceStore.setFinished(raceHorse.horseId, raceElapsedTime, finishCounter)
      }
    }

    if (raceStore.isAllFinished) {
      finishRace()
    } else {
      const frameId = requestAnimationFrame(gameLoop)
      raceStore.setAnimationFrameId(frameId)
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
    if (raceStore.animationFrameId !== null) {
      cancelAnimationFrame(raceStore.animationFrameId)
      raceStore.setAnimationFrameId(null)
    }
    horseStore.setGameStatus('paused')
  }

  async function resumeRace(): Promise<void> {
    horseStore.setGameStatus('countdown')
    raceStore.setLastTimestamp(null)

    await runCountdown()

    horseStore.setGameStatus('racing')
    const ts = performance.now()
    raceStore.setLastTimestamp(ts)
    const frameId = requestAnimationFrame(gameLoop)
    raceStore.setAnimationFrameId(frameId)
  }

  return { startRace, pauseRace, resumeRace }
}
