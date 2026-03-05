<script setup lang="ts">
import type { Surface } from '../../types/horse.types'

defineProps<{
  surface: Surface
}>()

const labels: Record<Surface, string> = {
  grass: 'Çim',
  sand: 'Kum',
  dirt: 'Toprak',
  synthetic: 'Sentetik',
}

const colors: Record<Surface, string> = {
  grass: 'bg-green-100 text-green-800',
  sand: 'bg-yellow-100 text-yellow-800',
  dirt: 'bg-amber-100 text-amber-800',
  synthetic: 'bg-blue-100 text-blue-800',
}
</script>

<template>
  <span class="inline-block rounded px-2 py-0.5 text-xs font-medium" :class="colors[surface]">
    {{ labels[surface] }}
  </span>
</template>
