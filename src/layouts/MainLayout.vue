<script setup>
import Navbar from '../components/navbar/Navbar.vue'
</script>

<template>
  <div class="min-h-screen bg-premium-white text-deep-charcoal">
    <Navbar />
    <main>
      <slot />
    </main>
  </div>
</template>
