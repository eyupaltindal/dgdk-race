<script setup lang="ts">
import HorseList from '../horse/HorseList.vue'
</script>

<template>
  <aside class="flex h-full flex-col overflow-hidden">
    <div class="border-b border-gray-200 px-4 py-3">
      <h2 class="text-sm font-bold uppercase tracking-wider text-gray-500">Atlar</h2>
    </div>
    <div class="flex-1 overflow-y-auto p-4">
      <HorseList />
    </div>
  </aside>
</template>
