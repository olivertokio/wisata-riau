<script setup>
import { ArrowUpRight } from 'lucide-vue-next'
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { categories } from '../../data/categories'
import {
  animateCategoryHover,
  animateCategoryLeave,
  createCategoryShowcaseAnimation,
} from '../../gsap/categoryAnimation'

const showcaseRoot = ref(null)
let animationContext

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
    <!-- Base atmosphere: edit these gradients to tune the overall dark cinematic mood. -->
    <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_4%,rgba(201,162,39,0.15),transparent_30%),radial-gradient(circle_at_82%_10%,rgba(47,107,79,0.22),transparent_34%),linear-gradient(180deg,#24332A_0%,#1F2933_42%,#17211D_100%)]"></div>

    <!-- Hero-to-section blend: soft cream fog that removes the hard line from the white hero area. -->
    <div class="pointer-events-none absolute inset-x-0 -top-10 h-64 bg-[linear-gradient(180deg,rgba(253,252,248,0.96)_0%,rgba(247,243,234,0.68)_22%,rgba(247,243,234,0.22)_48%,rgba(31,41,51,0)_100%)] blur-xl"></div>

    <!-- Thin atmospheric glow: adds depth without looking like a black shadow strip. -->
    <div class="pointer-events-none absolute inset-x-6 top-10 h-36 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(201,162,39,0.14)_0%,rgba(47,107,79,0.12)_42%,transparent_72%)] blur-3xl"></div>

    <!-- Readability veil: keeps the white title readable after the soft top fade. -->
    <div class="pointer-events-none absolute inset-x-0 top-0 h-80 bg-[linear-gradient(180deg,rgba(31,41,51,0)_0%,rgba(31,41,51,0.24)_46%,rgba(31,41,51,0.58)_100%)]"></div>

    <!-- Masked transition wash: adjust height/opacity if the hero-to-dark fade needs more or less softness. -->
    <div class="pointer-events-none absolute inset-x-0 top-0 h-72 bg-premium-white/18 backdrop-blur-sm [mask-image:linear-gradient(180deg,black_0%,rgba(0,0,0,0.58)_34%,transparent_100%)]"></div>

    <div class="relative mx-auto max-w-7xl">
      <div class="grid gap-8 lg:grid-cols-[0.86fr_1.14fr] lg:items-end">
        <div>
          <p class="category-kicker text-sm font-semibold uppercase text-soft-gold">Riau by experience</p>
          <h2 id="category-showcase-title" class="category-heading mt-4 max-w-3xl font-serif text-4xl font-semibold leading-[1.06] text-white sm:text-6xl">
            Lima cara membaca lanskap Riau.
          </h2>
        </div>

        <p class="category-lead max-w-2xl text-base leading-8 text-white/66 lg:justify-self-end">
          Kategori dibuat sebagai ruang visual yang besar, bukan daftar kecil. Pilih alam yang hening, budaya Melayu, pesisir, rasa lokal, atau jejak sejarah.
        </p>
      </div>

      <div class="category-showcase-grid mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-12 lg:gap-6">
        <RouterLink
          v-for="(category, index) in categories"
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
            <p class="text-sm font-semibold text-soft-gold">{{ category.destinationCount }} destinasi contoh</p>
            <h3 class="mt-3 font-serif text-4xl font-semibold leading-none text-white sm:text-5xl">
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
