<script setup>
import { AlertCircle, CheckCircle2, LoaderCircle, Sparkles } from 'lucide-vue-next'
import { ref } from 'vue'
import AddDestinationForm from '../components/forms/AddDestinationForm.vue'
import { addDestination } from '../services/destinationService'

const isSubmitting = ref(false)
const successMessage = ref('')
const errorMessage = ref('')
const resetToken = ref(0)

async function handleAddDestination(destination) {
  isSubmitting.value = true
  successMessage.value = ''
  errorMessage.value = ''

  try {
    await addDestination(destination)
    resetToken.value += 1
    successMessage.value = 'Destinasi baru berhasil disimpan ke JSON Server. Kamu bisa lanjut menambahkan destinasi lain atau membuka halaman explore.'
  } catch (error) {
    errorMessage.value = error?.response?.data?.message || 'Gagal menyimpan destinasi. Pastikan JSON Server aktif lalu coba lagi.'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <section class="mx-auto grid max-w-7xl gap-8 px-4 pb-10 pt-24 sm:px-6 sm:pb-12 sm:pt-28 lg:grid-cols-[0.92fr_1.08fr] lg:px-10">
    <div class="overflow-hidden rounded-[2rem] bg-[linear-gradient(155deg,#2F6B4F_0%,#244333_42%,#1F2933_100%)] p-8 text-white shadow-2xl shadow-green-950/15">
      <p class="font-semibold uppercase tracking-[0.2em] text-soft-gold">Kontribusi Wisatawan</p>
      <h1 class="mt-3 font-serif text-4xl font-semibold leading-tight">Tambah Destinasi Baru</h1>
      <p class="mt-5 leading-8 text-white/75">
        Lengkapi data destinasi wisata Riau yang ingin direkomendasikan agar pengunjung lain bisa menemukan tempat menarik baru dengan informasi yang lebih akurat.
      </p>

      <div class="mt-8 grid gap-3 sm:grid-cols-2">
        <div class="rounded-[1.6rem] border border-white/12 bg-white/10 p-5 backdrop-blur-xl">
          <p class="text-xs font-semibold uppercase tracking-[0.18em] text-white/60">Alur Submit</p>
          <p class="mt-3 text-sm leading-7 text-white/78">
            Form akan mengirim data langsung ke JSON Server `destinations`, lalu menyimpan ke `db.json`.
          </p>
        </div>
        <div class="rounded-[1.6rem] border border-white/12 bg-white/10 p-5 backdrop-blur-xl">
          <p class="text-xs font-semibold uppercase tracking-[0.18em] text-white/60">Field Wajib</p>
          <p class="mt-3 text-sm leading-7 text-white/78">
            Nama, kategori, lokasi, gambar, deskripsi, rating, latitude, dan longitude semuanya perlu diisi.
          </p>
        </div>
      </div>

      <div class="mt-8 overflow-hidden rounded-3xl">
        <img class="h-72 w-full object-cover" src="https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80" alt="Pemandangan wisata alam" />
      </div>
    </div>

    <div class="rounded-[2rem] border border-black/5 bg-white p-6 shadow-[0_26px_70px_rgba(31,41,51,0.08)] sm:p-8">
      <div class="flex items-start justify-between gap-4">
        <div>
          <p class="text-sm font-semibold uppercase tracking-[0.2em] text-soft-gold">Form Destinasi</p>
          <h2 class="mt-3 font-serif text-3xl font-semibold text-deep-charcoal">Lengkapi informasi utama</h2>
        </div>

        <div class="grid size-12 place-items-center rounded-full bg-soft-cream text-soft-gold">
          <Sparkles class="size-5" />
        </div>
      </div>

      <Transition
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="translate-y-2 opacity-0"
        enter-to-class="translate-y-0 opacity-100"
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="translate-y-0 opacity-100"
        leave-to-class="-translate-y-2 opacity-0"
      >
        <div
          v-if="successMessage"
          class="mt-6 rounded-[1.6rem] border border-nature-green/15 bg-[linear-gradient(135deg,rgba(47,107,79,0.08),rgba(201,162,39,0.08))] p-5 text-deep-charcoal"
        >
          <div class="flex items-start gap-3">
            <div class="grid size-11 shrink-0 place-items-center rounded-full bg-nature-green text-white shadow-sm">
              <CheckCircle2 class="size-5" />
            </div>
            <div>
              <p class="font-semibold text-nature-green">Destinasi berhasil disimpan</p>
              <p class="mt-2 text-sm leading-7 text-muted-gray">{{ successMessage }}</p>
              <RouterLink
                class="mt-4 inline-flex rounded-full bg-nature-green px-4 py-2 text-sm font-semibold text-white transition duration-300 hover:bg-deep-charcoal"
                to="/explore"
              >
                Buka Explore
              </RouterLink>
            </div>
          </div>
        </div>
      </Transition>

      <Transition
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="translate-y-2 opacity-0"
        enter-to-class="translate-y-0 opacity-100"
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="translate-y-0 opacity-100"
        leave-to-class="-translate-y-2 opacity-0"
      >
        <div
          v-if="errorMessage"
          class="mt-6 rounded-[1.6rem] border border-[#f59e0b]/20 bg-[#fff8eb] p-5 text-deep-charcoal"
        >
          <div class="flex items-start gap-3">
            <div class="grid size-11 shrink-0 place-items-center rounded-full bg-[#f59e0b] text-white shadow-sm">
              <AlertCircle class="size-5" />
            </div>
            <div>
              <p class="font-semibold text-[#b45309]">Gagal menyimpan destinasi</p>
              <p class="mt-2 text-sm leading-7 text-muted-gray">{{ errorMessage }}</p>
            </div>
          </div>
        </div>
      </Transition>

      <div v-if="isSubmitting" class="mt-6 inline-flex items-center gap-2 rounded-full border border-black/8 bg-soft-cream px-4 py-2 text-sm font-medium text-muted-gray">
        <LoaderCircle class="size-4 animate-spin text-nature-green" />
        Menyimpan ke JSON Server...
      </div>

      <div class="mt-6">
        <AddDestinationForm
          :loading="isSubmitting"
          :reset-token="resetToken"
          @submit="handleAddDestination"
        />
      </div>
    </div>
  </section>
</template>
