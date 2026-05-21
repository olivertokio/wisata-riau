<script setup>
import { ArrowRight, MapPin, Star } from 'lucide-vue-next'

defineProps({
  destination: {
    type: Object,
    required: true,
  },
})
</script>

<template>
  <RouterLink
    :to="`/destination/${destination.id}`"
    data-directory-card
    class="group block overflow-hidden rounded-[2rem] border border-white/75 bg-white/95 shadow-[0_20px_60px_rgba(31,41,51,0.08)] ring-1 ring-black/5 transition duration-500 hover:-translate-y-2 hover:shadow-[0_34px_90px_rgba(31,41,51,0.14)]"
  >
    <div class="relative overflow-hidden rounded-[1.7rem] m-2">
      <img
        class="h-80 w-full object-cover transition duration-700 group-hover:scale-110"
        :src="destination.image"
        :alt="destination.name"
      />
      <div class="absolute inset-0 bg-gradient-to-t from-deep-charcoal/80 via-deep-charcoal/18 to-transparent"></div>

      <div class="absolute inset-x-4 top-4 flex items-center justify-between gap-3">
        <span class="rounded-full bg-white/90 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-nature-green shadow-sm backdrop-blur">
          {{ destination.category }}
        </span>

        <span class="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/14 px-3 py-1.5 text-sm font-semibold text-white backdrop-blur-xl">
          <Star class="size-3.5 fill-soft-gold text-soft-gold" />
          {{ destination.rating }}
        </span>
      </div>

      <div class="absolute inset-x-5 bottom-5">
        <p class="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/18 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-white/84 backdrop-blur">
          <MapPin class="size-3.5 text-soft-gold" />
          {{ destination.location }}
        </p>
      </div>
    </div>

    <div class="px-6 pb-6 pt-4">
      <h3 class="planner-display text-[1.8rem] font-semibold leading-tight text-deep-charcoal">
        {{ destination.name }}
      </h3>

      <p class="mt-4 line-clamp-3 text-sm leading-7 text-muted-gray">
        {{ destination.description }}
      </p>

      <div class="mt-6 inline-flex items-center gap-2 rounded-full bg-deep-charcoal px-4 py-2.5 text-sm font-semibold text-white transition duration-300 group-hover:bg-nature-green">
        Lihat Detail
        <ArrowRight class="size-4 transition duration-300 group-hover:translate-x-1" />
      </div>
    </div>
  </RouterLink>
</template>
