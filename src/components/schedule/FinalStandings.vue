<script setup lang="ts">
import { computed } from 'vue'
import { useScheduleStore } from '../../stores/scheduleStore'
import SurfaceBadge from '../ui/SurfaceBadge.vue'
import type { Surface } from '../../types/horse.types'

const scheduleStore = useScheduleStore()

// Aggregate: count wins (1st place) per horse
const standings = computed(() => {
  const winCounts: Record<
    number,
    { name: string; color: string; wins: number; totalTime: number }
  > = {}

  for (const round of scheduleStore.completedRounds) {
    if (!round.result) continue
    for (const entry of round.result.finishOrder) {
      if (!winCounts[entry.horseId]) {
        winCounts[entry.horseId] = {
          name: entry.horseName,
          color: entry.horseColor,
          wins: 0,
          totalTime: 0,
        }
      }
      const record = winCounts[entry.horseId]
      if (record) {
        record.totalTime += entry.finishTime
        if (entry.position === 1) {
          record.wins++
        }
      }
    }
  }

  return Object.entries(winCounts)
    .map(([id, data]) => ({ horseId: Number(id), ...data }))
    .sort((a, b) => b.wins - a.wins || a.totalTime - b.totalTime)
})
</script>

<template>
  <div class="space-y-4">
    <!-- General standings -->
    <div class="rounded-2xl border border-yellow-200 bg-yellow-50 p-5">
      <h2 class="mb-4 text-center text-lg font-bold text-gray-800">Genel Sıralama</h2>
      <div class="space-y-2">
        <div
          v-for="(entry, idx) in standings"
          :key="entry.horseId"
          class="flex items-center gap-6 rounded-xl px-3 py-2 justify-between"
          :class="idx === 0 ? 'bg-yellow-200' : idx === 1 ? 'bg-gray-100' : 'bg-white'"
        >
          <div class="flex w-10 items-center gap-1.5">
            <span class="w-5 text-center text-sm font-bold text-gray-500">{{ idx + 1 }}</span>
            <div class="h-4 w-4 rounded-full" :style="{ backgroundColor: entry.color }" />
          </div>
          <div class="flex flex-col w-full">
            <span class="font-semibold text-gray-800 truncate">{{ entry.name }}</span>
            <span class="text-xs text-gray-500 whitespace-nowrap">
              {{ entry.wins }} galibiyet · {{ (entry.totalTime / 1000).toFixed(1) }}s
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Per-round results -->
    <div
      v-for="round in scheduleStore.completedRounds"
      :key="round.id"
      class="rounded-2xl border border-gray-200 bg-white p-4"
    >
      <div class="mb-3 flex items-center gap-2">
        <span class="font-bold text-gray-700">Tur {{ round.roundNumber }}</span>
        <span class="text-sm text-gray-400">{{ round.distance }}m</span>
        <SurfaceBadge :surface="round.surface as Surface" />
      </div>
      <div v-if="round.result" class="space-y-1">
        <div
          v-for="entry in round.result.finishOrder"
          :key="entry.horseId"
          class="flex items-center gap-2 rounded-lg px-2 py-1 text-xs"
          :class="entry.position === 1 ? 'bg-yellow-50 border border-yellow-200' : 'bg-gray-50'"
        >
          <span class="w-4 font-bold text-gray-500">{{ entry.position }}</span>
          <div
            class="h-2.5 w-2.5 rounded-full shrink-0"
            :style="{ backgroundColor: entry.horseColor }"
          />
          <span class="flex-1 font-medium text-gray-700">{{ entry.horseName }}</span>
          <span class="text-gray-400">{{ (entry.finishTime / 1000).toFixed(2) }}s</span>
        </div>
      </div>
    </div>
  </div>
</template>
