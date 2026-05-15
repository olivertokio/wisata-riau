<script setup>
import { reactive } from 'vue'

const emit = defineEmits(['submit'])

const form = reactive({
  name: '',
  rating: 5,
  comment: '',
})

function handleSubmit() {
  emit('submit', {
    ...form,
    rating: Number(form.rating),
    createdAt: new Date().toISOString(),
  })

  form.name = ''
  form.rating = 5
  form.comment = ''
}
</script>

<template>
  <form class="space-y-4" @submit.prevent="handleSubmit">
    <label class="block">
      <span class="mb-2 block font-semibold">Nama</span>
      <input v-model="form.name" class="w-full rounded-2xl border border-black/10 bg-soft-cream px-4 py-3 outline-none focus:ring-4 focus:ring-soft-gold/20" type="text" required placeholder="Nama pengunjung" />
    </label>

    <label class="block">
      <span class="mb-2 block font-semibold">Rating</span>
      <select v-model="form.rating" class="w-full rounded-2xl border border-black/10 bg-soft-cream px-4 py-3 outline-none focus:ring-4 focus:ring-soft-gold/20">
        <option v-for="score in 5" :key="score" :value="score">{{ score }}</option>
      </select>
    </label>

    <label class="block">
      <span class="mb-2 block font-semibold">Ulasan</span>
      <textarea v-model="form.comment" class="w-full resize-none rounded-2xl border border-black/10 bg-soft-cream px-4 py-3 outline-none focus:ring-4 focus:ring-soft-gold/20" required rows="4" placeholder="Bagikan pengalamanmu" />
    </label>

    <button class="w-full rounded-full bg-nature-green px-6 py-3 font-semibold text-white transition hover:bg-[#285c44]" type="submit">Kirim Ulasan</button>
  </form>
</template>
