<script setup>
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { destinations } from '../data/dummyData'

const route = useRoute()
const query = ref('')
const selectedCategory = ref(route.query.category || 'Semua')
const selectedLocation = ref('Semua')

const categories = computed(() => ['Semua', ...new Set(destinations.map((destination) => destination.category))])
const locations = computed(() => ['Semua', ...new Set(destinations.map((destination) => destination.location))])

const filteredDestinations = computed(() => {
  const keyword = query.value.trim().toLowerCase()

  return destinations.filter((destination) => {
    const matchesKeyword = !keyword || [destination.name, destination.category, destination.location]
      .join(' ')
      .toLowerCase()
      .includes(keyword)
    const matchesCategory = selectedCategory.value === 'Semua' || destination.category === selectedCategory.value
    const matchesLocation = selectedLocation.value === 'Semua' || destination.location === selectedLocation.value

    return matchesKeyword && matchesCategory && matchesLocation
  })
})
</script>

<template>
  <section class="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-10">
    <header class="rounded-[2rem] bg-deep-charcoal px-6 py-10 text-white shadow-2xl shadow-green-950/10 sm:px-10">
      <p class="font-semibold text-soft-gold">Direktori destinasi</p>
      <div class="mt-3 grid gap-6 lg:grid-cols-[1fr_28rem] lg:items-end">
        <div>
          <h1 class="text-4xl font-semibold sm:text-5xl">Explore Wisata Riau</h1>
          <p class="mt-4 max-w-2xl leading-8 text-white/70">
            Cari destinasi berdasarkan keyword, kategori, dan wilayah seperti Pekanbaru, Siak, Kampar, Dumai, atau pesisir Riau.
          </p>
        </div>

        <div class="rounded-3xl bg-white/10 p-3 backdrop-blur">
          <input
            v-model="query"
            class="w-full rounded-2xl border border-white/10 bg-white px-5 py-4 text-deep-charcoal outline-none transition placeholder:text-muted-gray focus:ring-4 focus:ring-soft-gold/25"
            type="search"
            placeholder="Cari pantai, kuliner, air terjun..."
          />
        </div>
      </div>
    </header>

    <div class="mt-6 grid gap-3 rounded-3xl border border-black/5 bg-white p-3 shadow-sm md:grid-cols-2">
      <label class="block">
        <span class="mb-2 block px-2 text-sm font-semibold text-muted-gray">Kategori</span>
        <select v-model="selectedCategory" class="w-full rounded-2xl border border-black/10 bg-soft-cream px-4 py-3 outline-none focus:ring-4 focus:ring-soft-gold/20">
          <option v-for="category in categories" :key="category" :value="category">{{ category }}</option>
        </select>
      </label>

      <label class="block">
        <span class="mb-2 block px-2 text-sm font-semibold text-muted-gray">Lokasi</span>
        <select v-model="selectedLocation" class="w-full rounded-2xl border border-black/10 bg-soft-cream px-4 py-3 outline-none focus:ring-4 focus:ring-soft-gold/20">
          <option v-for="location in locations" :key="location" :value="location">{{ location }}</option>
        </select>
      </label>
    </div>

    <div class="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <RouterLink
        v-for="destination in filteredDestinations"
        :key="destination.id"
        class="group overflow-hidden rounded-3xl border border-black/5 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-2xl hover:shadow-green-950/10"
        :to="`/destination/${destination.id}`"
      >
        <div class="relative">
          <img class="h-60 w-full object-cover transition duration-500 group-hover:scale-105" :src="destination.image" :alt="destination.name" />
          <span class="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-sm font-semibold text-nature-green backdrop-blur">
            {{ destination.category }}
          </span>
        </div>
        <div class="p-5">
          <div class="flex items-center justify-between gap-4">
            <strong class="text-xl">{{ destination.name }}</strong>
            <span class="rounded-full bg-soft-cream px-3 py-1 font-semibold text-soft-gold">{{ destination.rating }}</span>
          </div>
          <span class="mt-2 block text-muted-gray">{{ destination.location }}</span>
          <p class="mt-4 line-clamp-2 text-sm leading-6 text-muted-gray">{{ destination.description }}</p>
        </div>
      </RouterLink>
    </div>

    <div v-if="filteredDestinations.length === 0" class="mt-8 rounded-3xl border border-black/5 bg-white p-8 text-center shadow-sm">
      <h2 class="text-2xl font-semibold">Destinasi tidak ditemukan</h2>
      <p class="mt-2 text-muted-gray">Coba ubah kata kunci, kategori, atau lokasi pencarian.</p>
    </div>
  </section>
</template>
