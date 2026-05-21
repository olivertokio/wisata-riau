<script setup>
import { ArrowRight, Compass } from 'lucide-vue-next'
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { categories } from '../../data/categories'
import { destinations } from '../../data/dummyData'
import { destinationHasCategory } from '../../utils/destinationCategories'
import { createScrollReveal } from '../../gsap/scrollReveal'

const categoryRoot = ref(null)
let revealContext

const categoriesWithCounts = computed(() => {
  return categories.map((category) => ({
    ...category,
    // Jumlah destinasi kategori mengikuti data terbaru di src/data/dummyData.js
    destinationCount: destinations.filter((destination) => destinationHasCategory(destination, category.name)).length,
  }))
})

onMounted(() => {
  revealContext = createScrollReveal(categoryRoot.value, {
    targets: '.category-reveal',
    start: 'top 74%',
    y: 36,
    stagger: 0.09,
  })
})

onBeforeUnmount(() => {
  revealContext?.revert()
})
</script>

<template>
  <section
    ref="categoryRoot"
    class="relative overflow-hidden bg-premium-white px-4 py-20 sm:px-6 lg:px-10 lg:py-24"
    aria-labelledby="category-title"
  >
    <div class="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-soft-cream/50 to-premium-white"></div>

    <div class="relative mx-auto max-w-7xl">
      <div class="category-reveal grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-end">
        <div>
          <p class="inline-flex items-center gap-2 rounded-full border border-soft-gold/25 bg-white px-4 py-2 text-sm font-semibold text-nature-green shadow-sm">
            <Compass class="size-4 text-soft-gold" />
            Kategori wisata
          </p>
          <h2 id="category-title" class="planner-display mt-5 max-w-xl text-4xl font-semibold leading-tight text-deep-charcoal sm:text-5xl">
            Pilih cara terbaik menikmati Riau.
          </h2>
        </div>

        <p class="max-w-2xl text-base leading-8 text-muted-gray lg:justify-self-end">
          Dari pulau pesisir hingga peninggalan Melayu, setiap kategori dirancang sebagai pintu masuk yang jelas untuk menemukan ritme perjalanan yang kamu inginkan.
        </p>
      </div>

      <div class="-mx-4 mt-11 flex snap-x gap-4 overflow-x-auto px-4 pb-5 sm:-mx-6 sm:px-6 lg:mx-0 lg:grid lg:grid-cols-5 lg:overflow-visible lg:px-0 lg:pb-0">
        <RouterLink
          v-for="(category, index) in categoriesWithCounts"
          :key="category.id"
          class="category-reveal group relative min-h-[24rem] min-w-[18.5rem] snap-start overflow-hidden rounded-[2rem] bg-deep-charcoal text-white shadow-[0_28px_70px_rgba(31,41,51,0.10)] ring-1 ring-black/5 transition duration-500 hover:-translate-y-2 hover:shadow-[0_36px_90px_rgba(47,107,79,0.20)] lg:min-w-0"
          :to="`/explore?category=${category.name}`"
        >
          <img
            class="absolute inset-0 h-full w-full object-cover opacity-75 transition duration-700 group-hover:scale-110 group-hover:opacity-90"
            :src="category.image"
            :alt="`Kategori wisata ${category.name}`"
          />
          <div class="absolute inset-0 bg-[linear-gradient(180deg,rgba(31,41,51,0.08)_0%,rgba(31,41,51,0.58)_48%,rgba(31,41,51,0.94)_100%)]"></div>
          <div class="absolute inset-x-5 top-5 flex items-center justify-between">
            <span class="rounded-full border border-white/25 bg-white/15 px-3 py-1 text-xs font-semibold uppercase text-white backdrop-blur-xl">
              0{{ index + 1 }}
            </span>
            <span class="grid size-10 place-items-center rounded-full bg-white/15 backdrop-blur-xl transition duration-300 group-hover:bg-soft-gold">
              <ArrowRight class="size-4 transition duration-300 group-hover:-rotate-45" />
            </span>
          </div>

          <div class="absolute inset-x-0 bottom-0 p-5">
            <div class="mb-4 h-px w-full bg-gradient-to-r from-white/45 via-soft-gold/80 to-transparent"></div>
            <!-- Ubah label count kategori di sini jika nanti ingin diganti lagi. -->
            <p class="text-sm font-semibold text-soft-gold">{{ category.destinationCount }} destinasi</p>
            <h3 class="planner-display mt-2 text-3xl font-semibold">{{ category.name }}</h3>
            <p class="mt-3 min-h-20 text-sm leading-6 text-white/76">
              {{ category.description }}
            </p>
          </div>
        </RouterLink>
      </div>
    </div>
  </section>
</template>
