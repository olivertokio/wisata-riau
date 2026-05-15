import api from './api'

export async function getDestinations() {
  const response = await api.get('/destinations')
  return response.data
}

export async function addDestination(payload) {
  const response = await api.post('/destinations', payload)
  return response.data
}
