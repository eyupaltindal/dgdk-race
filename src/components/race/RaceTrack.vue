<script setup lang="ts">
import { computed } from 'vue'
import { useRaceStore } from '../../stores/raceStore'
import { useHorseStore } from '../../stores/horseStore'
import { useScheduleStore } from '../../stores/scheduleStore'
import type { Surface } from '../../types/horse.types'
import TrackLane from './TrackLane.vue'
import CountdownOverlay from './CountdownOverlay.vue'
import SurfaceBadge from '../ui/SurfaceBadge.vue'

const raceStore = useRaceStore()
const horseStore = useHorseStore()
const scheduleStore = useScheduleStore()

const lanes = computed(() =>
  raceStore.horses
    .map((rh) => ({
      raceHorse: rh,
      horse: horseStore.getHorseById(rh.horseId),
    }))
    .filter((l) => l.horse !== undefined),
)

const surfaceTrackBg: Record<Surface, string> = {
  grass: 'bg-green-50',
  sand: 'bg-yellow-50 ',
  dirt: 'bg-amber-50 ',
  synthetic: 'bg-blue-50',
}

const trackBg = computed(() => {
  const surface = scheduleStore.currentRound?.surface
  return surface ? surfaceTrackBg[surface] : 'bg-green-50' // default to grass if unknown
})
</script>

<template>
  <div
    class="relative rounded-2xl overflow-hidden p-3 flex flex-col gap-1.5 transition-colors duration-700"
    :class="trackBg"
  >
    <!-- Track header -->
    <div class="mb-1 flex items-center justify-between px-1">
      <span class="text-xs font-semibold tracking-widest">Pist</span>
      <span v-if="scheduleStore.currentRound" class="text-xs">
        {{ scheduleStore.currentRound.distance }}m
        <SurfaceBadge :surface="scheduleStore.currentRound.surface" />
      </span>
    </div>

    <TrackLane
      v-for="(lane, idx) in lanes"
      :key="lane.raceHorse.horseId"
      :horse="lane.horse!"
      :race-horse="lane.raceHorse"
      :position="idx + 1"
    />

    <!-- Empty state -->
    <div v-if="lanes.length === 0" class="flex h-48 items-center justify-center">
      <p class="text-2xl">Yarış başlatılmadı</p>
    </div>

    <CountdownOverlay />
  </div>
</template>
