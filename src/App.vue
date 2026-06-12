<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import CustomerServiceButton from './components/customer-service/CustomerServiceButton.vue'
import AdminLayout from './layouts/AdminLayout.vue'
import MainLayout from './layouts/MainLayout.vue'

const route = useRoute()

const activeLayout = computed(() => (route.meta.layout === 'admin' ? AdminLayout : MainLayout))
const showCustomerService = computed(() => route.meta.layout !== 'admin')
</script>

<template>
  <component :is="activeLayout">
    <RouterView />
  </component>
  <CustomerServiceButton v-if="showCustomerService" />
</template>
