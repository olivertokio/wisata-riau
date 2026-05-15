import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { reviews as dummyReviews } from '../data/dummyData'

export const useReviewStore = defineStore('reviews', () => {
  const reviews = ref([...dummyReviews])

  const reviewCount = computed(() => reviews.value.length)

  function getReviewsByDestination(destinationId) {
    return reviews.value.filter((review) => String(review.destinationId) === String(destinationId))
  }

  function addReview(review) {
    reviews.value.unshift({
      id: crypto.randomUUID(),
      ...review,
    })
  }

  return {
    reviews,
    reviewCount,
    getReviewsByDestination,
    addReview,
  }
})

