import { describe, it, expect, beforeEach } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import App from '@/App.vue'

describe('App', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('mounts and renders without errors', () => {
    const wrapper = shallowMount(App)
    expect(wrapper.exists()).toBe(true)
  })

  it('renders the main layout container', () => {
    const wrapper = shallowMount(App)
    expect(wrapper.find('div').exists()).toBe(true)
  })
})
