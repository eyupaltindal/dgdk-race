<script setup lang="ts">
import AppHeader from './components/layout/AppHeader.vue'
import LeftPanel from './components/layout/LeftPanel.vue'
import CenterPanel from './components/layout/CenterPanel.vue'
import RightPanel from './components/layout/RightPanel.vue'
import AbortModal from './components/ui/AbortModal.vue'
</script>

<template>
  <div class="flex min-h-screen flex-col bg-gray-50 lg:h-screen lg:overflow-hidden">
    <AppHeader />

    <div class="flex flex-1 flex-col lg:grid lg:overflow-hidden" style="grid-template-columns: 280px 1fr 320px;">
      <!-- Center: Race track (mobile: first) -->
      <div class="order-1 border-b border-gray-200 bg-gray-50 lg:order-2 lg:border-b-0 lg:overflow-hidden">
        <CenterPanel />
      </div>

      <!-- Right: Schedule / Results (mobile: second) -->
      <div class="order-2 border-b border-gray-200 bg-white lg:order-3 lg:border-b-0 lg:border-l lg:overflow-hidden">
        <RightPanel />
      </div>

      <!-- Left: Horse list (mobile: third) -->
      <div class="order-3 bg-white lg:order-1 lg:border-r lg:border-gray-200 lg:overflow-hidden">
        <LeftPanel />
      </div>
    </div>

    <AbortModal />
  </div>
</template>
