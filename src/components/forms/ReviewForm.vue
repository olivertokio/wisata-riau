<script setup>
import { AlertCircle, LoaderCircle, Star } from 'lucide-vue-next'
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
  rating: 5,
  comment: '',
})

const errors = reactive({
  name: '',
  rating: '',
  comment: '',
})

function resetErrors() {
  errors.name = ''
  errors.rating = ''
  errors.comment = ''
}

function resetForm() {
  form.name = ''
  form.rating = 5
  form.comment = ''
  resetErrors()
}

function validateForm() {
  resetErrors()

  if (!form.name.trim()) {
    errors.name = 'Nama pengunjung wajib diisi.'
  }

  const ratingValue = Number(form.rating)
  if (Number.isNaN(ratingValue) || ratingValue < 1 || ratingValue > 5) {
    errors.rating = 'Rating harus di antara 1 sampai 5.'
  }

  if (!form.comment.trim()) {
    errors.comment = 'Ulasan wajib diisi.'
  }

  return !Object.values(errors).some(Boolean)
}

function handleSubmit() {
  if (!validateForm()) {
    return
  }

  emit('submit', {
    name: form.name.trim(),
    rating: Number(form.rating),
    comment: form.comment.trim(),
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
  <form class="space-y-5" @submit.prevent="handleSubmit">
    <label class="block">
      <span class="mb-2 block font-semibold text-deep-charcoal">Nama</span>
      <input
        v-model="form.name"
        :disabled="loading"
        class="w-full rounded-2xl border border-black/10 bg-soft-cream px-4 py-3 outline-none transition focus:ring-4 focus:ring-soft-gold/20 disabled:cursor-not-allowed disabled:opacity-70"
        type="text"
        placeholder="Nama pengunjung"
      />
      <p v-if="errors.name" class="mt-2 text-sm text-[#b45309]">{{ errors.name }}</p>
    </label>

    <label class="block">
      <span class="mb-2 flex items-center gap-2 font-semibold text-deep-charcoal">
        <Star class="size-4 text-soft-gold" />
        Rating
      </span>
      <select
        v-model="form.rating"
        :disabled="loading"
        class="w-full rounded-2xl border border-black/10 bg-soft-cream px-4 py-3 outline-none transition focus:ring-4 focus:ring-soft-gold/20 disabled:cursor-not-allowed disabled:opacity-70"
      >
        <option v-for="score in 5" :key="score" :value="score">{{ score }}</option>
      </select>
      <p v-if="errors.rating" class="mt-2 text-sm text-[#b45309]">{{ errors.rating }}</p>
    </label>

    <label class="block">
      <span class="mb-2 block font-semibold text-deep-charcoal">Ulasan</span>
      <textarea
        v-model="form.comment"
        :disabled="loading"
        class="w-full resize-none rounded-2xl border border-black/10 bg-soft-cream px-4 py-3 outline-none transition focus:ring-4 focus:ring-soft-gold/20 disabled:cursor-not-allowed disabled:opacity-70"
        rows="4"
        placeholder="Bagikan pengalamanmu"
      />
      <p v-if="errors.comment" class="mt-2 text-sm text-[#b45309]">{{ errors.comment }}</p>
    </label>

    <div class="rounded-[1.4rem] border border-black/5 bg-premium-white px-4 py-4 text-sm text-muted-gray">
      <p class="flex items-start gap-2">
        <AlertCircle class="mt-0.5 size-4 shrink-0 text-soft-gold" />
        Ulasan akan langsung disimpan ke sistem review dan diperbarui secara realtime di halaman ini.
      </p>
    </div>

    <button
      :disabled="loading"
      class="inline-flex w-full items-center justify-center gap-2 rounded-full bg-nature-green px-6 py-3 font-semibold text-white transition hover:bg-[#285c44] disabled:cursor-not-allowed disabled:opacity-80"
      type="submit"
    >
      <LoaderCircle v-if="loading" class="size-4 animate-spin" />
      <span>{{ loading ? 'Menyimpan Ulasan...' : 'Kirim Ulasan' }}</span>
    </button>
  </form>
</template>
