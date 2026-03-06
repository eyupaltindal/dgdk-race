<script setup lang="ts">
import type { Result } from '@/types/result.types'

defineProps<{
  result: Result
}>()
</script>

<template>
  <div class="space-y-1 mt-2">
    <div
      v-for="entry in result.finishOrder"
      :key="entry.horseId"
      class="flex items-center gap-2 rounded-md px-2 py-1 text-xs"
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
</template>
