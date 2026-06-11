<script setup>
import { AlertCircle, LoaderCircle } from 'lucide-vue-next'
import { reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '../../stores/userStore'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const errorMessage = ref('')

const form = reactive({
  email: '',
  password: '',
})

async function handleLogin() {
  errorMessage.value = ''

  try {
    const user = await userStore.signIn({
      email: form.email.trim(),
      password: form.password,
    })
    const redirectPath = route.query.redirect?.toString()

    if (redirectPath) {
      router.push(redirectPath)
      return
    }

    router.push(user?.role === 'admin' ? '/admin' : '/profile')
  } catch (error) {
    errorMessage.value = error?.message || 'Email atau password tidak valid.'
  }
}
</script>

<template>
  <section class="mx-auto grid min-h-[calc(100vh-5rem)] max-w-6xl items-center gap-8 px-4 py-10 sm:px-6 lg:grid-cols-2 lg:px-10">
    <div>
      <p class="font-semibold text-nature-green">Akun pengguna</p>
      <h1 class="mt-3 text-4xl font-semibold sm:text-5xl">Login</h1>
      <p class="mt-4 leading-8 text-muted-gray">Masuk untuk memberi ulasan, menyimpan destinasi favorit, dan membuat rencana perjalanan personal.</p>
    </div>

    <form class="rounded-[2rem] border border-black/5 bg-white p-6 shadow-xl shadow-green-950/10 sm:p-8" @submit.prevent="handleLogin">
      <div v-if="errorMessage" class="mb-5 flex gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
        <AlertCircle class="mt-0.5 size-4 shrink-0" />
        <p>{{ errorMessage }}</p>
      </div>

      <label class="block">
        <span class="mb-2 block font-semibold">Email</span>
        <input v-model="form.email" class="w-full rounded-2xl border border-black/10 bg-soft-cream px-4 py-3 outline-none focus:ring-4 focus:ring-soft-gold/20" type="email" required placeholder="email@example.com" />
      </label>

      <label class="mt-4 block">
        <span class="mb-2 block font-semibold">Password</span>
        <input v-model="form.password" class="w-full rounded-2xl border border-black/10 bg-soft-cream px-4 py-3 outline-none focus:ring-4 focus:ring-soft-gold/20" type="password" required placeholder="Password" />
      </label>

      <button class="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-nature-green px-6 py-3 font-semibold text-white transition hover:bg-[#285c44] disabled:cursor-not-allowed disabled:opacity-70" type="submit" :disabled="userStore.isLoading">
        <LoaderCircle v-if="userStore.isLoading" class="size-4 animate-spin" />
        {{ userStore.isLoading ? 'Masuk...' : 'Masuk' }}
      </button>
      <RouterLink class="mt-4 block text-center font-semibold text-nature-green hover:text-soft-gold" to="/register">
        Belum punya akun? Daftar
      </RouterLink>
    </form>
  </section>
</template>
