<script setup>
import { AlertCircle, LoaderCircle, MapPinned, Star } from 'lucide-vue-next'
import { reactive, watch } from 'vue'

const props = defineProps({
  loading: {
    type: Boolean,
    default: false,
  },
  resetToken: {
    type: Number,
    default: 0,
  },
})

const emit = defineEmits(['submit'])

const form = reactive({
  name: '',
  category: '',
  location: '',
  image: '',
  description: '',
  rating: '4.5',
  latitude: '',
  longitude: '',
})

const errors = reactive({
  name: '',
  category: '',
  location: '',
  image: '',
  description: '',
  rating: '',
  latitude: '',
  longitude: '',
})

function resetErrors() {
  errors.name = ''
  errors.category = ''
  errors.location = ''
  errors.image = ''
  errors.description = ''
  errors.rating = ''
  errors.latitude = ''
  errors.longitude = ''
}

function resetForm() {
  form.name = ''
  form.category = ''
  form.location = ''
  form.image = ''
  form.description = ''
  form.rating = '4.5'
  form.latitude = ''
  form.longitude = ''
  resetErrors()
}

function validateForm() {
  resetErrors()

  if (!form.name.trim()) {
    errors.name = 'Nama destinasi wajib diisi.'
  }

  if (!form.category.trim()) {
    errors.category = 'Kategori wajib diisi.'
  }

  if (!form.location.trim()) {
    errors.location = 'Lokasi wajib diisi.'
  }

  if (!form.image.trim()) {
    errors.image = 'URL gambar wajib diisi.'
  }

  if (!form.description.trim()) {
    errors.description = 'Deskripsi wajib diisi.'
  }

  const ratingValue = Number(form.rating)
  if (!form.rating || Number.isNaN(ratingValue)) {
    errors.rating = 'Rating wajib berupa angka.'
  } else if (ratingValue < 1 || ratingValue > 5) {
    errors.rating = 'Rating harus di antara 1 sampai 5.'
  }

  const latitudeValue = Number(form.latitude)
  if (form.latitude === '' || Number.isNaN(latitudeValue)) {
    errors.latitude = 'Latitude wajib berupa angka.'
  }

  const longitudeValue = Number(form.longitude)
  if (form.longitude === '' || Number.isNaN(longitudeValue)) {
    errors.longitude = 'Longitude wajib berupa angka.'
  }

  return !Object.values(errors).some(Boolean)
}

function handleSubmit() {
  if (!validateForm()) {
    return
  }

  emit('submit', {
    name: form.name.trim(),
    category: form.category.trim(),
    location: form.location.trim(),
    image: form.image.trim(),
    description: form.description.trim(),
    rating: Number(form.rating),
    latitude: Number(form.latitude),
    longitude: Number(form.longitude),
  })
}

watch(
  () => props.resetToken,
  () => {
    resetForm()
  },
)
</script>

<template>
  <form class="grid gap-5" @submit.prevent="handleSubmit">
    <div class="grid gap-5 md:grid-cols-2">
      <label class="block">
        <span class="mb-2 block font-semibold text-deep-charcoal">Nama Destinasi</span>
        <input
          v-model="form.name"
          :disabled="loading"
          class="w-full rounded-2xl border border-black/10 bg-soft-cream px-4 py-3 outline-none transition focus:ring-4 focus:ring-soft-gold/20 disabled:cursor-not-allowed disabled:opacity-70"
          type="text"
          placeholder="Contoh: Pulau Jemur"
        />
        <p v-if="errors.name" class="mt-2 text-sm text-[#b45309]">{{ errors.name }}</p>
      </label>

      <label class="block">
        <span class="mb-2 block font-semibold text-deep-charcoal">Kategori</span>
        <input
          v-model="form.category"
          :disabled="loading"
          class="w-full rounded-2xl border border-black/10 bg-soft-cream px-4 py-3 outline-none transition focus:ring-4 focus:ring-soft-gold/20 disabled:cursor-not-allowed disabled:opacity-70"
          type="text"
          placeholder="Alam, budaya, bahari"
        />
        <p v-if="errors.category" class="mt-2 text-sm text-[#b45309]">{{ errors.category }}</p>
      </label>
    </div>

    <div class="grid gap-5 md:grid-cols-2">
      <label class="block">
        <span class="mb-2 block font-semibold text-deep-charcoal">Lokasi</span>
        <input
          v-model="form.location"
          :disabled="loading"
          class="w-full rounded-2xl border border-black/10 bg-soft-cream px-4 py-3 outline-none transition focus:ring-4 focus:ring-soft-gold/20 disabled:cursor-not-allowed disabled:opacity-70"
          type="text"
          placeholder="Kabupaten/Kota"
        />
        <p v-if="errors.location" class="mt-2 text-sm text-[#b45309]">{{ errors.location }}</p>
      </label>

      <label class="block">
        <span class="mb-2 flex items-center gap-2 font-semibold text-deep-charcoal">
          <Star class="size-4 text-soft-gold" />
          Rating
        </span>
        <input
          v-model="form.rating"
          :disabled="loading"
          class="w-full rounded-2xl border border-black/10 bg-soft-cream px-4 py-3 outline-none transition focus:ring-4 focus:ring-soft-gold/20 disabled:cursor-not-allowed disabled:opacity-70"
          type="number"
          min="1"
          max="5"
          step="0.1"
          placeholder="4.8"
        />
        <p v-if="errors.rating" class="mt-2 text-sm text-[#b45309]">{{ errors.rating }}</p>
      </label>
    </div>

    <label class="block">
      <span class="mb-2 block font-semibold text-deep-charcoal">URL Gambar</span>
      <input
        v-model="form.image"
        :disabled="loading"
        class="w-full rounded-2xl border border-black/10 bg-soft-cream px-4 py-3 outline-none transition focus:ring-4 focus:ring-soft-gold/20 disabled:cursor-not-allowed disabled:opacity-70"
          type="text"
        placeholder="https://... atau /images/wisata/nama-file.jpg"
      />
      <p v-if="errors.image" class="mt-2 text-sm text-[#b45309]">{{ errors.image }}</p>
    </label>

    <div class="grid gap-5 md:grid-cols-2">
      <label class="block">
        <span class="mb-2 flex items-center gap-2 font-semibold text-deep-charcoal">
          <MapPinned class="size-4 text-nature-green" />
          Latitude
        </span>
        <input
          v-model="form.latitude"
          :disabled="loading"
          class="w-full rounded-2xl border border-black/10 bg-soft-cream px-4 py-3 outline-none transition focus:ring-4 focus:ring-soft-gold/20 disabled:cursor-not-allowed disabled:opacity-70"
          type="number"
          step="any"
          placeholder="0.799"
        />
        <p v-if="errors.latitude" class="mt-2 text-sm text-[#b45309]">{{ errors.latitude }}</p>
      </label>

      <label class="block">
        <span class="mb-2 flex items-center gap-2 font-semibold text-deep-charcoal">
          <MapPinned class="size-4 text-nature-green" />
          Longitude
        </span>
        <input
          v-model="form.longitude"
          :disabled="loading"
          class="w-full rounded-2xl border border-black/10 bg-soft-cream px-4 py-3 outline-none transition focus:ring-4 focus:ring-soft-gold/20 disabled:cursor-not-allowed disabled:opacity-70"
          type="number"
          step="any"
          placeholder="102.043"
        />
        <p v-if="errors.longitude" class="mt-2 text-sm text-[#b45309]">{{ errors.longitude }}</p>
      </label>
    </div>

    <label class="block">
      <span class="mb-2 block font-semibold text-deep-charcoal">Deskripsi</span>
      <textarea
        v-model="form.description"
        :disabled="loading"
        class="w-full resize-none rounded-2xl border border-black/10 bg-soft-cream px-4 py-3 outline-none transition focus:ring-4 focus:ring-soft-gold/20 disabled:cursor-not-allowed disabled:opacity-70"
        rows="5"
        placeholder="Ceritakan daya tarik destinasi"
      />
      <p v-if="errors.description" class="mt-2 text-sm text-[#b45309]">{{ errors.description }}</p>
    </label>

    <div class="rounded-[1.6rem] border border-black/5 bg-premium-white px-4 py-4 text-sm text-muted-gray">
      <p class="flex items-start gap-2">
        <AlertCircle class="mt-0.5 size-4 shrink-0 text-soft-gold" />
        Pastikan seluruh field terisi lengkap. Data akan langsung dikirim ke JSON Server dan muncul di direktori wisata setelah berhasil disimpan.
      </p>
    </div>

    <button
      :disabled="loading"
      class="mt-1 inline-flex items-center justify-center gap-2 rounded-full bg-nature-green px-6 py-3.5 font-semibold text-white transition hover:bg-[#285c44] disabled:cursor-not-allowed disabled:opacity-80"
      type="submit"
    >
      <LoaderCircle v-if="loading" class="size-4 animate-spin" />
      <span>{{ loading ? 'Menyimpan Destinasi...' : 'Tambah Destinasi' }}</span>
    </button>
  </form>
</template>
