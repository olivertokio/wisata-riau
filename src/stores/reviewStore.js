import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import {
  addReview as createReview,
  getReviews,
  getReviewsByDestination as getSupabaseReviewsByDestination,
} from '../services/reviewService'

export const useReviewStore = defineStore('reviews', () => {
  const reviews = ref([])
  const isLoading = ref(false)
  const error = ref(null)

  const reviewCount = computed(() => reviews.value.length)

  function getReviewsByDestination(destinationId) {
    return reviews.value.filter((review) => {
      const reviewDestinationId = review.destination_id ?? review.destinationId
      return String(reviewDestinationId) === String(destinationId)
    })
  }

  async function fetchReviews() {
    isLoading.value = true
    error.value = null

    try {
      reviews.value = await getReviews()
    } catch (err) {
      error.value = err
      reviews.value = []
    } finally {
      isLoading.value = false
    }
  }

  async function fetchReviewsByDestination(destinationId) {
    isLoading.value = true
    error.value = null

    try {
      const data = await getSupabaseReviewsByDestination(destinationId)
      const otherReviews = reviews.value.filter((review) => {
        const reviewDestinationId = review.destination_id ?? review.destinationId
        return String(reviewDestinationId) !== String(destinationId)
      })
      reviews.value = [...data, ...otherReviews]
      return data
    } catch (err) {
      error.value = err
      return []
    } finally {
      isLoading.value = false
    }
  }

  async function addReview(review) {
    const createdReview = await createReview(review)
    reviews.value.unshift(createdReview)
    return createdReview
  }

  return {
    reviews,
    reviewCount,
    isLoading,
    error,
    fetchReviews,
    fetchReviewsByDestination,
    getReviewsByDestination,
    addReview,
  }
})
