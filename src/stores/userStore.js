import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import {
  getCurrentUser,
  loginUser,
  logoutUser,
  onAuthStateChange,
  registerUser,
} from '../services/authService'

export const useUserStore = defineStore('user', () => {
  const user = ref(null)
  const isLoading = ref(false)
  const isInitialized = ref(false)
  const error = ref('')
  let authSubscription = null

  const isAuthenticated = computed(() => Boolean(user.value))
  const isAdmin = computed(() => user.value?.role === 'admin')

  function setUser(payload) {
    user.value = payload
  }

  function login(payload) {
    setUser(payload)
  }

  async function initialize() {
    if (isInitialized.value) return user.value

    isLoading.value = true
    error.value = ''

    try {
      user.value = await getCurrentUser()
    } catch (err) {
      user.value = null
      error.value = err?.message || 'Session belum tersedia.'
    } finally {
      isLoading.value = false
      isInitialized.value = true
    }

    if (!authSubscription) {
      const { data } = onAuthStateChange((profile) => {
        user.value = profile
        isInitialized.value = true
      })
      authSubscription = data?.subscription
    }

    return user.value
  }

  async function register(payload) {
    isLoading.value = true
    error.value = ''

    try {
      user.value = await registerUser(payload)
      return user.value
    } catch (err) {
      error.value = err?.message || 'Gagal membuat akun.'
      throw err
    } finally {
      isLoading.value = false
      isInitialized.value = true
    }
  }

  async function signIn(payload) {
    isLoading.value = true
    error.value = ''

    try {
      user.value = await loginUser(payload)
      return user.value
    } catch (err) {
      error.value = err?.message || 'Gagal login.'
      throw err
    } finally {
      isLoading.value = false
      isInitialized.value = true
    }
  }

  async function logout() {
    isLoading.value = true
    error.value = ''

    try {
      await logoutUser()
    } finally {
      user.value = null
      localStorage.removeItem('riauscape_admin_session')
      isLoading.value = false
      isInitialized.value = true
    }
  }

  return {
    user,
    isLoading,
    isInitialized,
    error,
    isAuthenticated,
    isAdmin,
    initialize,
    register,
    signIn,
    login,
    logout,
    setUser,
  }
})
