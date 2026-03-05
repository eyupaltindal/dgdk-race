<script setup lang="ts">
import { useHorseStore } from '../../stores/horseStore'
import { useScheduleStore } from '../../stores/scheduleStore'
import { useRaceStore } from '../../stores/raceStore'
import { useRaceEngine } from '../../composables/useRaceEngine'

const horseStore = useHorseStore()
const scheduleStore = useScheduleStore()
const raceStore = useRaceStore()
const { stopAnimation } = useRaceEngine()

function cancel() {
  horseStore.closeAbortModal()
}

function confirm() {
  stopAnimation()
  raceStore.reset()
  scheduleStore.reset()
  horseStore.confirmAbort()
}
</script>

<template>
  <Teleport to="body">
    <div
      v-if="horseStore.ui.showAbortModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
      @click.self="cancel"
    >
      <div class="w-96 rounded-2xl bg-white p-8 shadow-2xl">
        <h2 class="mb-3 text-xl font-bold text-gray-900">Yarışı İptal Et</h2>
        <p class="mb-6 text-gray-600">Tüm ilerleme sıfırlanacak. Emin misiniz?</p>
        <div class="flex gap-3">
          <button
            class="flex-1 rounded-xl border border-gray-300 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            @click="cancel"
          >
            Vazgeç
          </button>
          <button
            class="flex-1 rounded-xl bg-red-600 py-2.5 text-sm font-medium text-white transition hover:bg-red-700"
            @click="confirm"
          >
            Evet, İptal Et
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
