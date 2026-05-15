import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { destinations as dummyDestinations } from '../data/dummyData'
import { getDestinations } from '../services/destinationService'

export const useDestinationStore = defineStore('destinations', () => {
  const destinations = ref([...dummyDestinations])
  const isLoading = ref(false)
  const error = ref(null)

  const popularDestinations = computed(() => destinations.value.slice(0, 6))

  async function fetchDestinations() {
    isLoading.value = true
    error.value = null

    try {
      destinations.value = await getDestinations()
    } catch (err) {
      error.value = err
    } finally {
      isLoading.value = false
    }
  }

  function addDestination(destination) {
    destinations.value.unshift(destination)
  }

  return {
    destinations,
    popularDestinations,
    isLoading,
    error,
    fetchDestinations,
    addDestination,
  }
})

