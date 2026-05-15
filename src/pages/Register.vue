<script setup>
import { reactive } from 'vue'

const form = reactive({
  name: '',
  email: '',
  password: '',
})

function handleRegister() {
  console.info('Register:', form.email)
}
</script>

<template>
  <section class="mx-auto grid min-h-[calc(100vh-5rem)] max-w-6xl items-center gap-8 px-4 py-10 sm:px-6 lg:grid-cols-2 lg:px-10">
    <div>
      <p class="font-semibold text-nature-green">Mulai eksplorasi</p>
      <h1 class="mt-3 text-4xl font-semibold sm:text-5xl">Register</h1>
      <p class="mt-4 leading-8 text-muted-gray">Buat akun untuk berbagi ulasan dan membantu wisata Riau makin mudah ditemukan.</p>
    </div>

    <form class="rounded-[2rem] border border-black/5 bg-white p-6 shadow-xl shadow-green-950/10 sm:p-8" @submit.prevent="handleRegister">
      <label class="block">
        <span class="mb-2 block font-semibold">Nama</span>
        <input v-model="form.name" class="w-full rounded-2xl border border-black/10 bg-soft-cream px-4 py-3 outline-none focus:ring-4 focus:ring-soft-gold/20" type="text" required placeholder="Nama lengkap" />
      </label>

      <label class="mt-4 block">
        <span class="mb-2 block font-semibold">Email</span>
        <input v-model="form.email" class="w-full rounded-2xl border border-black/10 bg-soft-cream px-4 py-3 outline-none focus:ring-4 focus:ring-soft-gold/20" type="email" required placeholder="email@example.com" />
      </label>

      <label class="mt-4 block">
        <span class="mb-2 block font-semibold">Password</span>
        <input v-model="form.password" class="w-full rounded-2xl border border-black/10 bg-soft-cream px-4 py-3 outline-none focus:ring-4 focus:ring-soft-gold/20" type="password" required placeholder="Password" />
      </label>

      <button class="mt-6 w-full rounded-full bg-nature-green px-6 py-3 font-semibold text-white transition hover:bg-[#285c44]" type="submit">Daftar</button>
      <RouterLink class="mt-4 block text-center font-semibold text-nature-green hover:text-soft-gold" to="/login">
        Sudah punya akun? Login
      </RouterLink>
    </form>
  </section>
</template>
