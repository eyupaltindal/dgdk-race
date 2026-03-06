<script setup lang="ts">
import { useRaceStore } from '@/stores/raceStore'
import { useHorseStore } from '@/stores/horseStore'
import { computed } from 'vue'

const raceStore = useRaceStore()
const horseStore = useHorseStore()

const visible = computed(
  () => horseStore.gameStatus === 'countdown' && raceStore.countdown !== null,
)
</script>

<template>
  <Transition name="countdown">
    <div
      v-if="visible"
      class="absolute inset-0 z-10 flex items-center justify-center bg-black/30 rounded-2xl"
    >
      <div
        class="text-8xl font-black text-white drop-shadow-2xl select-none"
        :class="raceStore.countdown === 'GO!' ? 'text-green-400! scale-125' : 'text-white'"
        style="text-shadow: 0 4px 24px rgba(0, 0, 0, 0.5)"
      >
        {{ raceStore.countdown }}
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.countdown-enter-active,
.countdown-leave-active {
  transition: all 0.2s ease;
}
.countdown-enter-from {
  opacity: 0;
  transform: scale(1.5);
}
.countdown-leave-to {
  opacity: 0;
  transform: scale(0.5);
}
</style>
