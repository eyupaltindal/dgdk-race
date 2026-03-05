<script setup lang="ts">
import { useScheduleStore } from '../../stores/scheduleStore'
import SurfaceBadge from '../ui/SurfaceBadge.vue'

const scheduleStore = useScheduleStore()
</script>

<template>
  <div v-if="scheduleStore.currentRound" class="flex items-center gap-4 text-sm">
    <span class="font-semibold text-gray-700">
      Tur {{ scheduleStore.currentRound.roundNumber }} / 6
    </span>
    <span class="text-gray-500">{{ scheduleStore.currentRound.distance }}m</span>
    <SurfaceBadge :surface="scheduleStore.currentRound.surface" />
  </div>
</template>
