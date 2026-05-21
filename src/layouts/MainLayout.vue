<script setup>
import Navbar from '../components/navbar/Navbar.vue'
</script>

<template>
  <div class="min-h-screen bg-premium-white text-deep-charcoal">
    <Navbar />
    <main class="overflow-x-hidden">
      <slot />
    </main>
  </div>
</template>
