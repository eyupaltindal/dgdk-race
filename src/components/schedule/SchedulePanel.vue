<script setup lang="ts">
import { useScheduleStore } from '@/stores/scheduleStore'
import RoundCard from '@/components/schedule/RoundCard.vue'

const scheduleStore = useScheduleStore()
</script>

<template>
  <div>
    <div v-if="!scheduleStore.isGenerated" class="flex h-32 items-center justify-center">
      <p class="text-sm text-gray-400">Program henüz oluşturulmadı</p>
    </div>
    <div v-else class="space-y-3">
      <RoundCard v-for="round in scheduleStore.schedule!.rounds" :key="round.id" :round="round" />
    </div>
  </div>
</template>
