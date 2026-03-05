<script setup lang="ts">
defineProps<{
  value: number
}>()
</script>

<template>
  <div class="h-2 w-full rounded-full bg-gray-200 overflow-hidden">
    <div
      class="h-full rounded-full transition-all duration-300"
      :class="{
        'bg-green-500': value >= 80,
        'bg-yellow-500': value >= 60 && value < 80,
        'bg-red-500': value < 60,
      }"
      :style="{ width: `${value}%` }"
    />
  </div>
</template>
