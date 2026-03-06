<script setup lang="ts">
import { useHorseStore } from '@/stores/horseStore'
import { useScheduleStore } from '@/stores/scheduleStore'
import { useRaceStore } from '@/stores/raceStore'
import { useRaceEngine } from '@/composables/useRaceEngine'

const horseStore = useHorseStore()
const scheduleStore = useScheduleStore()
const raceStore = useRaceStore()
const { startRace, pauseRace, resumeRace } = useRaceEngine()

function handleGenerate() {
  // Reset stores if re-generating
  raceStore.reset()
  scheduleStore.reset()
  horseStore.reset()

  horseStore.initHorses()
  scheduleStore.generateSchedule(horseStore.horses)
  horseStore.setGameStatus('scheduled')
}

function handleStart() {
  startRace()
}

function handlePause() {
  pauseRace()
}

function handleResume() {
  resumeRace()
}

function handleAbort() {
  horseStore.openAbortModal()
}

// const status = () => horseStore.gameStatus
</script>

<template>
  <div class="flex flex-wrap items-center justify-center gap-2">
    <!-- Generate -->
    <button
      class="rounded-xl px-5 py-2.5 text-sm font-semibold transition-all"
      :class="
        ['idle', 'scheduled', 'gameOver'].includes(horseStore.gameStatus)
          ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md'
          : 'cursor-not-allowed bg-gray-100 text-gray-400'
      "
      :disabled="!['idle', 'scheduled', 'gameOver'].includes(horseStore.gameStatus)"
      @click="handleGenerate"
    >
      Oluştur
    </button>

    <!-- Start -->
    <button
      class="rounded-xl px-5 py-2.5 text-sm font-semibold transition-all"
      :class="
        horseStore.gameStatus === 'scheduled'
          ? 'bg-green-600 text-white hover:bg-green-700 shadow-md'
          : 'cursor-not-allowed bg-gray-100 text-gray-400'
      "
      :disabled="horseStore.gameStatus !== 'scheduled'"
      @click="handleStart"
    >
      Başlat
    </button>

    <!-- Pause -->
    <button
      v-if="horseStore.gameStatus === 'racing'"
      class="rounded-xl bg-yellow-500 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-yellow-600"
      @click="handlePause"
    >
      Duraklat
    </button>

    <!-- Resume -->
    <button
      v-if="horseStore.gameStatus === 'paused'"
      class="rounded-xl bg-green-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-green-700"
      @click="handleResume"
    >
      Devam Et
    </button>

    <!-- Abort -->
    <button
      v-if="['countdown', 'racing', 'paused'].includes(horseStore.gameStatus)"
      class="rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-red-700"
      @click="handleAbort"
    >
      İptal Et
    </button>
  </div>
</template>
