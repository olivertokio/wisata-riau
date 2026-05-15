<script setup>
import { ArrowRight, MapPin, Sparkles, Star } from 'lucide-vue-next'
import { computed } from 'vue'

const props = defineProps({
  featuredDestination: {
    type: Object,
    default: null,
  },
  destinations: {
    type: Array,
    default: () => [],
  },
})

const secondaryDestinations = computed(() => props.destinations.slice(0, 3))
</script>

<template>
  <aside
    v-if="featuredDestination"
    data-explore-featured
    class="order-1 xl:order-2 xl:sticky xl:top-[11rem]"
  >
    <div class="overflow-hidden rounded-[2rem] border border-white/80 bg-white/95 p-4 shadow-[0_28px_80px_rgba(31,41,51,0.08)] ring-1 ring-black/5 backdrop-blur">
      <div class="flex items-center justify-between gap-3 px-2 pb-4">
        <div>
          <p class="text-xs font-semibold uppercase tracking-[0.24em] text-soft-gold">Rekomendasi Teratas</p>
          <h3 class="mt-2 font-serif text-2xl font-semibold text-deep-charcoal">Pilihan editor</h3>
        </div>

        <div class="grid size-11 place-items-center rounded-full bg-soft-cream text-soft-gold">
          <Sparkles class="size-5" />
        </div>
      </div>

      <RouterLink
        :to="`/destination/${featuredDestination.id}`"
        class="group block overflow-hidden rounded-[1.6rem] border border-black/5 bg-soft-cream"
      >
        <div class="relative overflow-hidden">
          <img
            class="h-56 w-full object-cover transition duration-700 group-hover:scale-110"
            :src="featuredDestination.image"
            :alt="featuredDestination.name"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-deep-charcoal/82 via-transparent to-transparent"></div>
          <div class="absolute inset-x-4 bottom-4">
            <p class="inline-flex items-center gap-1.5 rounded-full border border-white/18 bg-white/14 px-3 py-1.5 text-sm font-semibold text-white backdrop-blur-xl">
              <Star class="size-3.5 fill-soft-gold text-soft-gold" />
              {{ featuredDestination.rating }}
            </p>
          </div>
        </div>

        <div class="p-5">
          <span class="text-xs font-semibold uppercase tracking-[0.22em] text-nature-green">{{ featuredDestination.category }}</span>
          <h4 class="mt-3 font-serif text-2xl font-semibold leading-tight text-deep-charcoal">
            {{ featuredDestination.name }}
          </h4>
          <p class="mt-3 flex items-center gap-2 text-sm font-medium text-muted-gray">
            <MapPin class="size-4 text-nature-green" />
            {{ featuredDestination.location }}
          </p>
          <p class="mt-4 line-clamp-3 text-sm leading-7 text-muted-gray">
            {{ featuredDestination.description }}
          </p>
          <span class="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-deep-charcoal">
            Lihat Detail
            <ArrowRight class="size-4 transition duration-300 group-hover:translate-x-1" />
          </span>
        </div>
      </RouterLink>

      <div v-if="secondaryDestinations.length > 0" class="mt-4 rounded-[1.6rem] bg-premium-white p-3">
        <p class="px-2 pb-3 text-xs font-semibold uppercase tracking-[0.22em] text-muted-gray">Jelajah Cepat</p>

        <div class="grid gap-2">
          <RouterLink
            v-for="(destination, index) in secondaryDestinations"
            :key="destination.id"
            :to="`/destination/${destination.id}`"
            class="group grid grid-cols-[3.8rem_1fr_auto] items-center gap-3 rounded-[1.2rem] bg-white px-3 py-3 transition duration-300 hover:-translate-y-0.5 hover:shadow-sm"
          >
            <img
              class="h-14 w-full rounded-xl object-cover"
              :src="destination.image"
              :alt="destination.name"
            />

            <span class="min-w-0">
              <span class="block truncate text-sm font-semibold text-deep-charcoal">{{ destination.name }}</span>
              <span class="mt-1 block truncate text-xs text-muted-gray">{{ destination.location }}</span>
            </span>

            <span class="font-serif text-lg text-soft-gold">0{{ index + 2 }}</span>
          </RouterLink>
        </div>
      </div>
    </div>
  </aside>
</template>
