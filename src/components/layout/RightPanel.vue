<script setup lang="ts">
import { useHorseStore } from '@/stores/horseStore'
import SchedulePanel from '@/components/schedule/SchedulePanel.vue'
import FinalStandings from '@/components/schedule/FinalStandings.vue'

const horseStore = useHorseStore()
</script>

<template>
  <aside class="flex h-full flex-col overflow-hidden">
    <div class="border-b border-gray-200 px-4 py-3">
      <h2 class="text-sm font-bold uppercase tracking-wider text-gray-500">
        {{ horseStore.gameStatus === 'gameOver' ? 'Sonuçlar' : 'Program' }}
      </h2>
    </div>
    <div class="flex-1 overflow-y-auto p-4">
      <FinalStandings v-if="horseStore.gameStatus === 'gameOver'" />
      <SchedulePanel v-else />
    </div>
  </aside>
</template>
