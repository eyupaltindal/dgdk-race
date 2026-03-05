<script setup lang="ts">
import { useHorseStore } from '../../stores/horseStore'

const horseStore = useHorseStore()

const statusLabels: Record<string, string> = {
  idle: 'Hazır',
  scheduled: 'Program Hazır',
  countdown: 'Geri Sayım',
  racing: 'Yarış Sürüyor',
  paused: 'Duraklatıldı',
  roundResult: 'Tur Sonucu',
  gameOver: 'Oyun Bitti',
}

const statusColors: Record<string, string> = {
  idle: 'text-gray-500',
  scheduled: 'text-blue-600',
  countdown: 'text-orange-500',
  racing: 'text-green-600',
  paused: 'text-yellow-600',
  roundResult: 'text-purple-600',
  gameOver: 'text-indigo-700',
}
</script>

<template>
  <header class="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
    <div class="flex items-center gap-3">
      <span class="text-2xl">🏇🏻 🏇🏻 🏇🏻</span>
      <h1 class="text-xl font-bold text-gray-900 hidden md:block">Atlar Yarışıyor</h1>
    </div>
    <div class="flex items-center gap-2">
      <span
        class="h-2.5 w-2.5 rounded-full"
        :class="{
          'bg-gray-400': horseStore.gameStatus === 'idle',
          'bg-blue-500': horseStore.gameStatus === 'scheduled',
          'bg-orange-500 animate-pulse': horseStore.gameStatus === 'countdown',
          'bg-green-500 animate-pulse': horseStore.gameStatus === 'racing',
          'bg-yellow-500': horseStore.gameStatus === 'paused',
          'bg-purple-500': horseStore.gameStatus === 'roundResult',
          'bg-indigo-600': horseStore.gameStatus === 'gameOver',
        }"
      />
      <span class="text-sm font-medium" :class="statusColors[horseStore.gameStatus]">
        {{ statusLabels[horseStore.gameStatus] }}
      </span>
    </div>
  </header>
</template>
