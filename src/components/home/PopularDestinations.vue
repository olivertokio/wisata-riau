<script setup>
import { ArrowRight, MapPin, Star } from 'lucide-vue-next'
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { popularDestinations } from '../../data/destinations'
import { createScrollReveal } from '../../gsap/scrollReveal'

const popularRoot = ref(null)
let revealContext

function destinationPath(destination) {
  return [1, 2, 4].includes(destination.id)
    ? `/destination/${destination.id}`
    : `/explore?category=${destination.category}`
}

onMounted(() => {
  revealContext = createScrollReveal(popularRoot.value, {
    targets: '.popular-reveal',
    start: 'top 74%',
    y: 34,
    stagger: 0.08,
  })
})

onBeforeUnmount(() => {
  revealContext?.revert()
})
</script>

<template>
  <section
    ref="popularRoot"
    class="relative overflow-hidden bg-[linear-gradient(180deg,#FDFCF8_0%,#F7F3EA_46%,#FDFCF8_100%)] px-4 py-20 sm:px-6 lg:px-10 lg:py-24"
    aria-labelledby="popular-title"
  >
    <div class="mx-auto max-w-7xl">
      <div class="popular-reveal flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p class="font-semibold text-nature-green">Destinasi populer</p>
          <h2 id="popular-title" class="mt-3 font-serif text-4xl font-semibold leading-tight text-deep-charcoal sm:text-5xl">
            Pilihan wisatawan minggu ini.
          </h2>
        </div>

        <RouterLink
          class="group inline-flex w-fit items-center gap-2 rounded-full border border-black/10 bg-white/80 px-5 py-3 text-sm font-semibold text-deep-charcoal shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-soft-gold/50 hover:bg-white"
          to="/explore"
        >
          Lihat semua
          <ArrowRight class="size-4 transition duration-300 group-hover:translate-x-1" />
        </RouterLink>
      </div>

      <div class="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <article
          v-for="destination in popularDestinations"
          :key="destination.name"
          class="popular-reveal group overflow-hidden rounded-[2rem] border border-white/70 bg-white p-2 shadow-[0_22px_70px_rgba(31,41,51,0.08)] ring-1 ring-black/5 transition duration-500 hover:-translate-y-2 hover:shadow-[0_34px_95px_rgba(47,107,79,0.18)]"
        >
          <div class="relative overflow-hidden rounded-[1.55rem]">
            <img
              class="h-72 w-full object-cover transition duration-700 group-hover:scale-110"
              :src="destination.image"
              :alt="destination.name"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-deep-charcoal/62 via-transparent to-transparent opacity-80"></div>
            <span class="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1.5 text-xs font-bold uppercase text-nature-green shadow-sm backdrop-blur">
              Populer
            </span>
            <span class="absolute bottom-4 left-4 rounded-full border border-white/25 bg-white/15 px-3 py-1.5 text-sm font-semibold text-white backdrop-blur-xl">
              {{ destination.category }}
            </span>
          </div>

          <div class="p-5">
            <div class="flex items-start justify-between gap-4">
              <div class="min-w-0">
                <h3 class="font-serif text-2xl font-semibold leading-tight text-deep-charcoal">
                  {{ destination.name }}
                </h3>
                <p class="mt-3 flex items-center gap-2 text-sm font-medium text-muted-gray">
                  <MapPin class="size-4 text-nature-green" />
                  {{ destination.location }}
                </p>
              </div>

              <div class="shrink-0 rounded-2xl bg-soft-cream px-3 py-2 text-right">
                <p class="flex items-center justify-end gap-1 font-semibold text-soft-gold">
                  <Star class="size-4 fill-soft-gold" />
                  {{ destination.rating }}
                </p>
                <p class="mt-1 text-xs text-muted-gray">{{ destination.reviewCount }} ulasan</p>
              </div>
            </div>

            <p class="mt-5 line-clamp-2 text-sm leading-6 text-muted-gray">
              {{ destination.description }}
            </p>

            <RouterLink
              class="mt-6 inline-flex items-center gap-2 rounded-full bg-deep-charcoal px-4 py-2.5 text-sm font-semibold text-white transition duration-300 hover:bg-nature-green"
              :to="destinationPath(destination)"
            >
              Detail
              <ArrowRight class="size-4" />
            </RouterLink>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>
