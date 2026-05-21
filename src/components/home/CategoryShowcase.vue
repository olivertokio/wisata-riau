<script setup>
import { ArrowUpRight } from 'lucide-vue-next'
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { categories } from '../../data/categories'
import { destinations } from '../../data/dummyData'
import { destinationHasCategory } from '../../utils/destinationCategories'
import {
  animateCategoryHover,
  animateCategoryLeave,
  createCategoryShowcaseAnimation,
} from '../../gsap/categoryAnimation'

const showcaseRoot = ref(null)
let animationContext

const categoriesWithCounts = computed(() => {
  return categories.map((category) => ({
    ...category,
    // Jumlah destinasi kategori mengikuti data terbaru di src/data/dummyData.js
    destinationCount: destinations.filter((destination) => destinationHasCategory(destination, category.name)).length,
  }))
})

const cardLayouts = [
  'lg:col-span-7 lg:min-h-[34rem]',
  'lg:col-span-5 lg:mt-16 lg:min-h-[27rem]',
  'lg:col-span-4 lg:min-h-[26rem]',
  'lg:col-span-4 lg:-mt-8 lg:min-h-[30rem]',
  'lg:col-span-4 lg:min-h-[26rem]',
]

function cardClass(index) {
  return cardLayouts[index] || 'lg:col-span-4 lg:min-h-[26rem]'
}

function handleImageError(event, category) {
  if (event.currentTarget.src !== category.fallbackImage) {
    event.currentTarget.src = category.fallbackImage
  }
}

onMounted(() => {
  animationContext = createCategoryShowcaseAnimation(showcaseRoot.value)
})

onBeforeUnmount(() => {
  animationContext?.revert()
})
</script>

<template>
  <section
    ref="showcaseRoot"
    class="relative isolate overflow-hidden bg-deep-charcoal px-4 py-20 text-white sm:px-6 lg:px-10 lg:py-28"
    aria-labelledby="category-showcase-title"
  >
    <!-- Base atmosphere: soft cinematic multi-layer blend without hard dividers. -->
    <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_16%_6%,rgba(201,162,39,0.11),transparent_28%),radial-gradient(circle_at_82%_12%,rgba(47,107,79,0.16),transparent_32%),radial-gradient(circle_at_52%_34%,rgba(255,255,255,0.04),transparent_24%),linear-gradient(180deg,#28352D_0%,#212D27_34%,#1C2622_66%,#18211E_100%)]"></div>

    <!-- Top atmospheric fade: blends naturally from the lighter section above. -->
    <div class="pointer-events-none absolute inset-x-0 -top-14 h-72 bg-[linear-gradient(180deg,rgba(253,252,248,0.94)_0%,rgba(247,243,234,0.62)_20%,rgba(247,243,234,0.18)_42%,rgba(24,33,30,0)_100%)] blur-2xl"></div>

    <!-- Ambient glow: soft foggy light instead of a dark horizontal overlay strip. -->
    <div class="pointer-events-none absolute inset-x-10 top-6 h-40 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(201,162,39,0.10)_0%,rgba(47,107,79,0.10)_40%,rgba(255,255,255,0.03)_58%,transparent_76%)] blur-3xl"></div>

    <!-- Soft tonal veil: keeps depth and readability without introducing hard lines. -->
    <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(255,255,255,0.05),transparent_24%),linear-gradient(180deg,rgba(20,29,25,0.08)_0%,rgba(20,29,25,0.16)_36%,rgba(20,29,25,0.26)_72%,rgba(20,29,25,0.34)_100%)]"></div>

    <!-- Bottom fade: smooth exit so the section blends elegantly into the next block. -->
    <div class="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-[linear-gradient(180deg,rgba(24,33,30,0)_0%,rgba(24,33,30,0.18)_42%,rgba(24,33,30,0.34)_100%)] blur-xl"></div>

    <div class="relative mx-auto max-w-7xl">
      <div class="grid gap-8 lg:grid-cols-[0.86fr_1.14fr] lg:items-end">
        <div>
          <p class="category-kicker text-sm font-semibold uppercase text-soft-gold">Riau by experience</p>
          <h2 id="category-showcase-title" class="category-heading planner-display mt-4 max-w-3xl text-4xl font-semibold leading-[1.06] text-white sm:text-6xl">
            Lima cara membaca lanskap Riau.
          </h2>
        </div>

        <p class="category-lead max-w-2xl text-base leading-8 text-white/66 lg:justify-self-end">
          Kategori dibuat sebagai ruang visual yang besar, bukan daftar kecil. Pilih alam yang hening, budaya Melayu, pesisir, rasa lokal, atau jejak sejarah.
        </p>
      </div>

      <div class="category-showcase-grid mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-12 lg:gap-6">
        <RouterLink
          v-for="(category, index) in categoriesWithCounts"
          :key="category.id"
          class="category-showcase-card group relative min-h-[27rem] overflow-hidden rounded-[2.25rem] bg-black shadow-[0_34px_100px_rgba(0,0,0,0.28)] ring-1 ring-white/10"
          :class="cardClass(index)"
          :to="`/explore?category=${category.name}`"
          @pointerenter="animateCategoryHover($event.currentTarget)"
          @pointerleave="animateCategoryLeave($event.currentTarget)"
        >
          <img
            class="category-media absolute inset-0 h-[112%] w-full scale-[1.14] object-cover"
            :src="category.image"
            :alt="`Wisata ${category.name} Riau`"
            @error="handleImageError($event, category)"
          />
          <div class="category-shade absolute inset-0 opacity-[0.78] bg-[linear-gradient(180deg,rgba(0,0,0,0.05)_0%,rgba(0,0,0,0.24)_38%,rgba(0,0,0,0.88)_100%)]"></div>
          <div class="absolute inset-0 border border-white/10"></div>

          <div class="absolute left-5 top-5 flex items-center gap-3">
            <span class="rounded-full border border-white/20 bg-white/15 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-white backdrop-blur-xl">
              {{ category.eyebrow }}
            </span>
          </div>

          <span class="absolute right-5 top-5 grid size-11 place-items-center rounded-full bg-white/16 text-white backdrop-blur-xl transition duration-300 group-hover:bg-soft-gold group-hover:text-deep-charcoal">
            <ArrowUpRight class="size-5" />
          </span>

          <div class="category-content absolute inset-x-0 bottom-0 p-6 sm:p-7">
            <!-- Ubah label count kategori di sini jika nanti ingin diganti lagi. -->
            <p class="text-sm font-semibold text-soft-gold">{{ category.destinationCount }} destinasi</p>
            <h3 class="planner-display mt-3 text-4xl font-semibold leading-none text-white sm:text-5xl">
              {{ category.name }}
            </h3>
            <p class="mt-4 max-w-xl text-sm leading-7 text-white/72 sm:text-base">
              {{ category.description }}
            </p>
          </div>
        </RouterLink>
      </div>
    </div>
  </section>
</template>
