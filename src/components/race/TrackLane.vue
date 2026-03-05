<script setup lang="ts">
import { computed } from 'vue'
import type { Horse } from '../../types/horse.types'
import type { RaceHorse } from '../../types/race.types'
import { useRaceStore } from '../../stores/raceStore'
import HorseAvatar from './HorseAvatar.vue'

const props = defineProps<{
  horse: Horse
  raceHorse: RaceHorse
  position: number // 1-based lane number
}>()

const raceStore = useRaceStore()

// Map 0-100 position to CSS percentage (leave margin for the horse width)
// Reads from raceStore.positions — reactive Record updated at 60fps, independent of horses array
const leftPercent = computed(() => {
  const pos = Math.min(raceStore.positions[props.raceHorse.horseId] ?? 0, 100)
  return `calc(${pos}% - 48px)`
})
</script>

<template>
  <div
    class="relative flex items-center overflow-hidden rounded-lg bg-transparent"
    :style="{ height: '64px', border: `2px solid ${horse.color}60` }"
  >
    <!-- Lane number + horse name label -->
    <div class="absolute left-2 z-10 flex items-center gap-1.5">
      <span
        class="flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold text-white"
        :style="{ backgroundColor: horse.color }"
        >{{ position }}</span
      >
      <span class="text-xs font-medium">{{ horse.name }}</span>
    </div>

    <!-- Finish line -->
    <div class="absolute right-0 top-0 h-full w-0.5" />

    <!-- Horse avatar -->
    <div
      class="absolute transition-none"
      :style="{ left: leftPercent, top: '60%', transform: 'translateY(-50%)' }"
    >
      <HorseAvatar :size="48" :finished="raceHorse.finished" />
    </div>
    <!-- Finished indicator -->
    <div v-if="raceHorse.finished" class="absolute right-12 z-10 text-xs font-bold drop-shadow">
      #{{ raceHorse.finishPosition }}
    </div>
  </div>
</template>
