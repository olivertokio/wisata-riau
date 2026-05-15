<script setup>
import { reactive } from 'vue'

const emit = defineEmits(['submit'])

const form = reactive({
  name: '',
  category: '',
  location: '',
  description: '',
  image: '',
})

function handleSubmit() {
  emit('submit', {
    ...form,
    id: crypto.randomUUID(),
  })

  form.name = ''
  form.category = ''
  form.location = ''
  form.description = ''
  form.image = ''
}
</script>

<template>
  <form class="grid gap-4" @submit.prevent="handleSubmit">
    <label class="block">
      <span class="mb-2 block font-semibold">Nama Destinasi</span>
      <input v-model="form.name" class="w-full rounded-2xl border border-black/10 bg-soft-cream px-4 py-3 outline-none focus:ring-4 focus:ring-soft-gold/20" type="text" required placeholder="Contoh: Pulau Jemur" />
    </label>

    <label class="block">
      <span class="mb-2 block font-semibold">Kategori</span>
      <input v-model="form.category" class="w-full rounded-2xl border border-black/10 bg-soft-cream px-4 py-3 outline-none focus:ring-4 focus:ring-soft-gold/20" type="text" required placeholder="Pantai, budaya, alam" />
    </label>

    <label class="block">
      <span class="mb-2 block font-semibold">Lokasi</span>
      <input v-model="form.location" class="w-full rounded-2xl border border-black/10 bg-soft-cream px-4 py-3 outline-none focus:ring-4 focus:ring-soft-gold/20" type="text" required placeholder="Kabupaten/Kota" />
    </label>

    <label class="block">
      <span class="mb-2 block font-semibold">URL Gambar</span>
      <input v-model="form.image" class="w-full rounded-2xl border border-black/10 bg-soft-cream px-4 py-3 outline-none focus:ring-4 focus:ring-soft-gold/20" type="url" placeholder="/images/wisata/nama-file.jpg" />
    </label>

    <label class="block">
      <span class="mb-2 block font-semibold">Deskripsi</span>
      <textarea v-model="form.description" class="w-full resize-none rounded-2xl border border-black/10 bg-soft-cream px-4 py-3 outline-none focus:ring-4 focus:ring-soft-gold/20" required rows="5" placeholder="Ceritakan daya tarik destinasi" />
    </label>

    <button class="mt-2 rounded-full bg-nature-green px-6 py-3 font-semibold text-white transition hover:bg-[#285c44]" type="submit">Tambah Destinasi</button>
  </form>
</template>
