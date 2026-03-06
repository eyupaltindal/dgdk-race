<script setup lang="ts">
import { computed } from 'vue'
import { useHorseStore } from '@/stores/horseStore'
import { useRaceStore } from '@/stores/raceStore'
import RaceTrack from '@/components/race/RaceTrack.vue'
import RaceInfo from '@/components/race/RaceInfo.vue'
import RaceLeaderboard from '@/components/race/RaceLeaderboard.vue'
import GameControls from '@/components/controls/GameControls.vue'

const horseStore = useHorseStore()
const raceStore = useRaceStore()

const showLeaderboard = computed(
  () =>
    ['racing', 'paused', 'countdown', 'roundResult'].includes(horseStore.gameStatus) &&
    raceStore.horses.length > 0,
)
</script>

<template>
  <main class="flex h-full flex-col overflow-hidden">
    <div class="border-b border-gray-200 px-4 py-3">
      <div class="flex flex-col md:flex-row items-center gap-4">
        <div class="flex-1">
          <RaceInfo />
        </div>
        <GameControls />
      </div>
    </div>

    <div class="flex flex-1 flex-col gap-4 overflow-y-auto p-4">
      <!-- Race track -->
      <RaceTrack />

      <!-- Live leaderboard during race -->
      <div v-if="showLeaderboard" class="rounded-2xl border border-gray-200 bg-white p-4">
        <h3 class="mb-3 text-sm font-bold uppercase tracking-wider text-gray-500">
          Anlık Sıralama
        </h3>
        <RaceLeaderboard />
      </div>
    </div>
  </main>
</template>
