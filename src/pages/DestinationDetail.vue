<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { destinations, reviews } from '../data/dummyData'
import ReviewForm from '../components/forms/ReviewForm.vue'

const route = useRoute()

const destination = computed(() => {
  return destinations.find((item) => String(item.id) === String(route.params.id))
})

const destinationReviews = computed(() => {
  return reviews.filter((review) => String(review.destinationId) === String(route.params.id))
})
</script>

<template>
  <section v-if="destination" class="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-10">
    <div class="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
      <div class="overflow-hidden rounded-[2rem] bg-white p-3 shadow-2xl shadow-green-950/10 ring-1 ring-black/5">
        <img class="h-[34rem] w-full rounded-[1.5rem] object-cover" :src="destination.image" :alt="destination.name" />
      </div>

      <div class="rounded-[2rem] border border-black/5 bg-white p-6 shadow-sm sm:p-8">
        <div class="mb-5 flex flex-wrap items-center gap-3">
          <span class="rounded-full bg-soft-cream px-4 py-2 text-sm font-semibold text-nature-green">{{ destination.category }}</span>
          <span class="rounded-full bg-soft-gold/15 px-4 py-2 text-sm font-semibold text-soft-gold">{{ destination.rating }} rating</span>
        </div>

        <h1 class="text-4xl font-semibold leading-tight sm:text-5xl">{{ destination.name }}</h1>
        <p class="mt-3 text-lg font-medium text-muted-gray">{{ destination.location }}</p>
        <p class="mt-6 leading-8 text-muted-gray">{{ destination.description }}</p>

        <div class="mt-8 grid grid-cols-2 gap-3">
          <div class="rounded-3xl bg-soft-cream p-5">
            <span class="text-sm text-muted-gray">Latitude</span>
            <strong class="mt-1 block text-lg">{{ destination.latitude }}</strong>
          </div>
          <div class="rounded-3xl bg-soft-cream p-5">
            <span class="text-sm text-muted-gray">Longitude</span>
            <strong class="mt-1 block text-lg">{{ destination.longitude }}</strong>
          </div>
        </div>

        <div class="mt-8 rounded-3xl bg-nature-green p-6 text-white">
          <p class="font-semibold text-soft-gold">Peta interaktif</p>
          <div class="mt-4 grid h-52 place-items-center rounded-2xl border border-white/15 bg-white/10 text-center text-white/80">
            Marker lokasi {{ destination.name }}
          </div>
        </div>
      </div>
    </div>

    <section class="mt-10 grid gap-8 lg:grid-cols-[0.95fr_1.05fr]" aria-labelledby="review-title">
      <div class="rounded-[2rem] border border-black/5 bg-white p-6 shadow-sm sm:p-8">
        <p class="font-semibold text-nature-green">Bagikan pengalaman</p>
        <h2 class="mt-2 text-3xl font-semibold">Tambah ulasan</h2>
        <ReviewForm class="mt-6" />
      </div>

      <div class="rounded-[2rem] border border-black/5 bg-white p-6 shadow-sm sm:p-8">
        <h2 id="review-title" class="text-3xl font-semibold">Ulasan Pengunjung</h2>
        <div class="mt-6 space-y-4">
          <article v-for="review in destinationReviews" :key="review.id" class="rounded-3xl bg-soft-cream p-5">
            <div class="flex items-center justify-between gap-4">
              <strong>{{ review.name }}</strong>
              <span class="font-semibold text-soft-gold">{{ review.rating }}/5</span>
            </div>
            <p class="mt-3 leading-7 text-muted-gray">{{ review.comment }}</p>
          </article>
        </div>
        <p v-if="destinationReviews.length === 0" class="mt-5 text-muted-gray">Belum ada ulasan untuk destinasi ini.</p>
      </div>
    </section>
  </section>

  <section v-else class="mx-auto max-w-3xl px-4 py-24 text-center sm:px-6">
    <h1 class="text-4xl font-semibold">Destinasi tidak ditemukan</h1>
    <RouterLink class="mt-6 inline-flex rounded-full bg-nature-green px-6 py-3 font-semibold text-white" to="/explore">
      Kembali ke Explore
    </RouterLink>
  </section>
</template>
