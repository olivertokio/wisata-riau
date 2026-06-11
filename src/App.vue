<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AdminLayout from './layouts/AdminLayout.vue'
import MainLayout from './layouts/MainLayout.vue'

const route = useRoute()

const activeLayout = computed(() => (route.meta.layout === 'admin' ? AdminLayout : MainLayout))
</script>

<template>
  <component :is="activeLayout">
    <RouterView />
  </component>
</template>
