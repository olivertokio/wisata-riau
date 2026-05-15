import api from './api'

export async function getDestinations() {
  const response = await api.get('/destinations')
  return response.data
}

export async function getDestinationById(id) {
  const response = await api.get(`/destinations/${id}`)
  return response.data
}

export async function createDestination(payload) {
  const response = await api.post('/destinations', payload)
  return response.data
}

