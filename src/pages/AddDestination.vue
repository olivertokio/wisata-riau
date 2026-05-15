<script setup>
import AddDestinationForm from '../components/forms/AddDestinationForm.vue'

function handleAddDestination(destination) {
  console.info('Destinasi baru:', destination)
}
</script>

<template>
  <section class="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-10">
    <div class="rounded-[2rem] bg-nature-green p-8 text-white shadow-2xl shadow-green-950/15">
      <p class="font-semibold text-soft-gold">Kontribusi wisatawan</p>
      <h1 class="mt-3 text-4xl font-semibold leading-tight">Tambah Destinasi Baru</h1>
      <p class="mt-5 leading-8 text-white/75">
        Lengkapi data destinasi wisata Riau yang ingin direkomendasikan agar pengunjung lain bisa menemukan tempat menarik baru.
      </p>
      <div class="mt-8 overflow-hidden rounded-3xl">
        <img class="h-72 w-full object-cover" src="https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80" alt="Pemandangan wisata alam" />
      </div>
    </div>

    <div class="rounded-[2rem] border border-black/5 bg-white p-6 shadow-sm sm:p-8">
      <AddDestinationForm @submit="handleAddDestination" />
    </div>
  </section>
</template>
