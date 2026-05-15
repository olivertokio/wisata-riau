import api from './api'

export async function getReviewsByDestination(destinationId) {
  const response = await api.get('/reviews', {
    params: {
      destinationId: Number(destinationId),
    },
  })

  return response.data
}

export async function addReview(payload) {
  const response = await api.post('/reviews', payload)
  return response.data
}
