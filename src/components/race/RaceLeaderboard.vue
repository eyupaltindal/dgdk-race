<script setup lang="ts">
import { useRaceStore } from '@/stores/raceStore'
import { useHorseStore } from '@/stores/horseStore'
import { computed } from 'vue'

const raceStore = useRaceStore()
const horseStore = useHorseStore()

const entries = computed(() =>
  raceStore.leaderboard.map((rh) => ({
    raceHorse: rh,
    horse: horseStore.getHorseById(rh.horseId),
  })),
)
</script>

<template>
  <div class="space-y-1">
    <div
      v-for="(entry, idx) in entries"
      :key="entry.raceHorse.horseId"
      class="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm"
      :class="entry.raceHorse.finished ? 'bg-yellow-50' : 'bg-gray-50'"
    >
      <span class="w-5 font-bold text-gray-500">{{ idx + 1 }}</span>
      <div class="h-3 w-3 rounded-full shrink-0" :style="{ backgroundColor: entry.horse?.color }" />
      <span class="flex-1 font-medium text-gray-800">{{ entry.horse?.name }}</span>
      <span v-if="entry.raceHorse.finished" class="text-xs text-yellow-600 font-semibold">
        {{ (entry.raceHorse.finishTime! / 1000).toFixed(2) }}s
      </span>
      <span v-else class="text-xs text-gray-400">
        {{ (raceStore.positions[entry.raceHorse.horseId] ?? 0).toFixed(1) }}%
      </span>
    </div>
  </div>
</template>
