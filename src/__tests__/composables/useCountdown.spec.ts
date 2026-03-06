import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useCountdown } from '@/composables/useCountdown'
import { useRaceStore } from '@/stores/raceStore'

describe('useCountdown', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('immediately sets countdown to 3 on start', () => {
    const raceStore = useRaceStore()
    const { runCountdown } = useCountdown()

    runCountdown()

    expect(raceStore.countdown).toBe(3)
  })

  it('progresses through [3, 2, 1, "GO!"] in 1000ms steps', async () => {
    const raceStore = useRaceStore()
    const { runCountdown } = useCountdown()

    const promise = runCountdown()

    expect(raceStore.countdown).toBe(3)

    await vi.advanceTimersByTimeAsync(1000)
    expect(raceStore.countdown).toBe(2)

    await vi.advanceTimersByTimeAsync(1000)
    expect(raceStore.countdown).toBe(1)

    await vi.advanceTimersByTimeAsync(1000)
    expect(raceStore.countdown).toBe('GO!')

    await vi.advanceTimersByTimeAsync(1000)
    expect(raceStore.countdown).toBeNull()

    await promise
  })

  it('resolves the promise after all steps complete', async () => {
    const { runCountdown } = useCountdown()
    let resolved = false

    const promise = runCountdown().then(() => {
      resolved = true
    })

    expect(resolved).toBe(false)

    await vi.advanceTimersByTimeAsync(4000)
    await promise

    expect(resolved).toBe(true)
  })

  it('sets countdown to null after completing', async () => {
    const raceStore = useRaceStore()
    const { runCountdown } = useCountdown()

    const promise = runCountdown()
    await vi.advanceTimersByTimeAsync(4000)
    await promise

    expect(raceStore.countdown).toBeNull()
  })

  it('does not resolve before all steps are complete', async () => {
    const { runCountdown } = useCountdown()
    let resolved = false

    const promise = runCountdown().then(() => {
      resolved = true
    })

    await vi.advanceTimersByTimeAsync(3000) // only 3 steps, not the final one
    expect(resolved).toBe(false)

    await vi.advanceTimersByTimeAsync(1000) // final step
    await promise
    expect(resolved).toBe(true)
  })
})
