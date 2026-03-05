<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    color: string
    direction?: 'left' | 'right'
    size?: number
  }>(),
  { direction: 'right', size: 48 },
)

const transform = computed(() =>
  props.direction === 'left' ? 'scale(-1, 1) translate(-100, 0)' : '',
)
</script>

<template>
  <svg
    :width="size"
    :height="size * 0.7"
    viewBox="0 0 100 70"
    xmlns="http://www.w3.org/2000/svg"
    :fill="color"
  >
    <!-- Main body -->
    <ellipse cx="50" cy="42" rx="28" ry="16" :transform="transform" />

    <!-- Neck -->
    <path
      d="M66 36 C70 28 72 22 68 16 C65 12 60 12 58 16 C56 20 58 28 62 34 Z"
      :transform="transform"
    />

    <!-- Head -->
    <ellipse cx="65" cy="13" rx="9" ry="7" :transform="transform" />

    <!-- Muzzle -->
    <ellipse cx="72" cy="16" rx="5" ry="4" :transform="transform" />

    <!-- Ear -->
    <polygon points="60,7 63,2 66,7" :transform="transform" />

    <!-- Eye -->
    <circle cx="68" cy="11" r="1.5" fill="white" :transform="transform" />
    <circle cx="68.5" cy="11" r="0.8" fill="#1a1a1a" :transform="transform" />

    <!-- Nostril -->
    <ellipse cx="74" cy="18" rx="1.5" ry="1" fill="#00000040" :transform="transform" />

    <!-- Mane -->
    <path
      d="M60 14 C58 18 57 24 60 28 C58 26 55 20 56 14 C57 10 59 8 60 14 Z"
      fill="#00000030"
      :transform="transform"
    />

    <!-- Tail -->
    <path
      d="M22 38 C14 32 10 26 12 20 C14 28 18 34 24 40 Z"
      fill="#00000030"
      :transform="transform"
    />
    <path
      d="M22 40 C12 38 6 34 8 28 C12 36 18 40 24 42 Z"
      fill="#00000020"
      :transform="transform"
    />

    <!-- Front legs -->
    <rect x="56" y="56" width="5" height="13" rx="2" :transform="transform" />
    <rect x="63" y="56" width="5" height="13" rx="2" :transform="transform" />

    <!-- Back legs -->
    <rect x="33" y="56" width="5" height="13" rx="2" :transform="transform" />
    <rect x="40" y="56" width="5" height="13" rx="2" :transform="transform" />

    <!-- Hooves (slightly darker) -->
    <rect x="56" y="66" width="5" height="3" rx="1" fill="#00000050" :transform="transform" />
    <rect x="63" y="66" width="5" height="3" rx="1" fill="#00000050" :transform="transform" />
    <rect x="33" y="66" width="5" height="3" rx="1" fill="#00000050" :transform="transform" />
    <rect x="40" y="66" width="5" height="3" rx="1" fill="#00000050" :transform="transform" />
  </svg>
</template>
