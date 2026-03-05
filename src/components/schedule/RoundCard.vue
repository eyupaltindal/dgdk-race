<script setup lang="ts">
import type { Round } from '../../types/schedule.types'
import { useHorseStore } from '../../stores/horseStore'
import SurfaceBadge from '../ui/SurfaceBadge.vue'
import RoundResult from './RoundResult.vue'

defineProps<{
  round: Round
}>()

const horseStore = useHorseStore()

const statusConfig = {
  pending: { label: 'Bekliyor', classes: 'text-gray-400' },
  racing: { label: 'Koşuluyor...', classes: 'text-green-600 animate-pulse' },
  finished: { label: 'Tamamlandı', classes: 'text-blue-600' },
}
</script>

<template>
  <div
    class="rounded-xl border p-3 transition-all duration-200"
    :class="{
      'border-green-400 shadow-md shadow-green-50': round.status === 'racing',
      'border-blue-200 bg-blue-50/30': round.status === 'finished',
      'border-gray-200 bg-white opacity-60': round.status === 'pending',
    }"
  >
    <!-- Round header -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <span class="text-sm font-bold text-gray-700">Tur {{ round.roundNumber }}</span>
        <span class="text-xs text-gray-500">{{ round.distance }}m</span>
        <SurfaceBadge :surface="round.surface" />
      </div>
      <span class="text-xs font-medium" :class="statusConfig[round.status].classes">
        {{ statusConfig[round.status].label }}
      </span>
    </div>

    <!-- Fixture: horse list (when not finished) -->
    <div v-if="round.result === null" class="mt-2 flex flex-wrap gap-1">
      <div
        v-for="id in round.horseIds"
        :key="id"
        class="flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600"
      >
        <div
          class="h-2 w-2 rounded-full"
          :style="{ backgroundColor: horseStore.getHorseById(id)?.color }"
        />
        {{ horseStore.getHorseById(id)?.name }} | {{ horseStore.getHorseById(id)?.baseCondition }}
      </div>
    </div>

    <!-- Result: finish order -->
    <RoundResult v-else :result="round.result" />
  </div>
</template>
