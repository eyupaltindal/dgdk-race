<script setup lang="ts">
import type { Horse, Surface } from '../../types/horse.types'
import ConditionBar from '../ui/ConditionBar.vue'
import SurfaceBadge from '../ui/SurfaceBadge.vue'

defineProps<{
  horse: Horse
}>()

const statusConfig = {
  idle: { label: 'Hazır', classes: 'bg-gray-100 text-gray-500' },
  racing: { label: 'Koşuyor', classes: 'bg-green-100 text-green-700', pulse: true },
  resting: { label: 'Bekliyor', classes: 'bg-yellow-100 text-yellow-700' },
  forcedRest: { label: 'Dinleniyor', classes: 'bg-red-100 text-red-700' },
}

const surfaceBg: Record<Surface, string> = {
  grass: 'bg-green-50 border-green-100',
  sand: 'bg-yellow-50 border-yellow-100',
  dirt: 'bg-amber-50 border-amber-100',
  synthetic: 'bg-blue-50 border-blue-100',
}
</script>

<template>
  <div
    class="rounded-xl border p-3 transition-all duration-200"
    :class="[
      horse.status === 'racing'
        ? 'border-green-400 shadow-md shadow-green-100'
        : surfaceBg[horse.favoriteSurface],
    ]"
  >
    <div class="flex items-start justify-between gap-2">
      <!-- Color + name -->
      <div class="flex items-center gap-2 min-w-0">
        <div
          class="h-4 w-4 shrink-0 rounded-full border-2 border-white shadow"
          :style="{ backgroundColor: horse.color }"
        />
        <span class="truncate text-sm font-semibold text-gray-800">{{ horse.name }}</span>
      </div>

      <!-- Status badge -->
      <span
        class="shrink-0 rounded-full px-2 py-0.5 text-xs font-medium"
        :class="statusConfig[horse.status].classes"
      >
        <span
          v-if="horse.status === 'racing'"
          class="mr-1 inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-green-500"
        />
        {{ statusConfig[horse.status].label }}
      </span>
    </div>

    <div class="mt-2 space-y-1.5">
      <!-- Condition -->
      <div class="flex items-center gap-2">
        <span class="w-16 shrink-0 text-xs text-gray-500">Kondisyon</span>
        <div class="flex-1">
          <ConditionBar :value="horse.baseCondition" />
        </div>
        <span class="w-8 text-right text-xs font-medium text-gray-700">
          {{ horse.baseCondition }}
        </span>
      </div>

      <!-- Favorite surface -->
      <div class="flex items-center gap-2">
        <span class="text-xs text-gray-500">Favori Zemini</span>
        <SurfaceBadge :surface="horse.favoriteSurface" />
      </div>
    </div>
  </div>
</template>
