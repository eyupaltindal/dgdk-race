<script setup lang="ts">
import { useHorseStore } from '../../stores/horseStore'
import HorseCard from './HorseCard.vue'

const horseStore = useHorseStore()
</script>

<template>
  <div>
    <div v-if="horseStore.horses.length === 0" class="flex h-32 items-center justify-center">
      <p class="text-sm text-gray-400">Atlar henüz oluşturulmadı</p>
    </div>
    <div v-else class="space-y-2">
      <HorseCard
        v-for="horse in horseStore.horses"
        :key="horse.id"
        :horse="horse"
      />
    </div>
  </div>
</template>
