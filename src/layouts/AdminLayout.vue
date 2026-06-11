<script setup>
import { ref } from 'vue'
import Sidebar from '../components/admin/Sidebar.vue'
import Topbar from '../components/admin/Topbar.vue'

const sidebarOpen = ref(false)
</script>

<template>
  <div class="min-h-screen bg-[#F7F3EA] text-deep-charcoal">
    <div
      v-if="sidebarOpen"
      class="fixed inset-0 z-30 bg-deep-charcoal/30 lg:hidden"
      @click="sidebarOpen = false"
    />

    <div class="lg:grid lg:grid-cols-[18rem_1fr]">
      <Sidebar :open="sidebarOpen" @close="sidebarOpen = false" />
      <div class="min-w-0">
        <Topbar @toggle-sidebar="sidebarOpen = true" />
        <main class="px-4 py-6 sm:px-6 lg:px-8">
          <slot />
        </main>
      </div>
    </div>
  </div>
</template>
