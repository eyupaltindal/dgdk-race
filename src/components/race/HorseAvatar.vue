<script setup lang="ts">
import { computed } from 'vue'
import { DotLottieVue } from '@lottiefiles/dotlottie-vue'

const props = withDefaults(
  defineProps<{
    direction?: 'left' | 'right'
    size?: number
    src?: string
    finished?: boolean
  }>(),
  {
    direction: 'left',
    size: 200,
    src: 'horse-run.lottie',
    finished: false,
  },
)

const containerStyle = computed(() => ({
  width: `${props.size}px`,
  height: `${props.size}px`,
  transform: props.direction === 'left' ? 'scaleX(-1)' : 'scaleX(1)',
  transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
}))
</script>

<template>
  <div class="horse-animation-wrapper" :style="containerStyle">
    <DotLottieVue style="width: 100%; height: 100%" autoplay :loop="!finished" :src="src" />
  </div>
</template>

<style scoped>
.horse-animation-wrapper {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}
</style>
