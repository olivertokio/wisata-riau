<script setup>
import { ArrowRight, MapPin, Star } from 'lucide-vue-next'

defineProps({
  destination: {
    type: Object,
    required: true,
  },
})

function handleImageError(event, destination) {
  if (event.currentTarget.src !== destination.fallbackImage) {
    event.currentTarget.src = destination.fallbackImage
  }
}
</script>

<template>
  <article class="w-[18.5rem] overflow-hidden rounded-[1.4rem] bg-white text-deep-charcoal shadow-[0_28px_70px_rgba(31,41,51,0.22)] ring-1 ring-black/5">
    <div class="relative h-36 overflow-hidden">
      <img
        class="h-full w-full object-cover"
        :src="destination.image"
        :alt="destination.title"
        @error="handleImageError($event, destination)"
      />
      <div class="absolute inset-0 bg-gradient-to-t from-black/58 to-transparent"></div>
      <span class="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-bold uppercase text-nature-green backdrop-blur">
        {{ destination.category }}
      </span>
    </div>

    <div class="p-4">
      <div class="flex items-start justify-between gap-3">
        <h3 class="font-serif text-xl font-semibold leading-tight">{{ destination.title }}</h3>
        <span class="inline-flex shrink-0 items-center gap-1 rounded-full bg-soft-cream px-2.5 py-1 text-sm font-semibold text-soft-gold">
          <Star class="size-3.5 fill-soft-gold" />
          {{ destination.rating }}
        </span>
      </div>

      <p class="mt-2 flex items-center gap-1.5 text-sm font-medium text-muted-gray">
        <MapPin class="size-4 text-nature-green" />
        {{ destination.location }}
      </p>
      <p class="mt-3 line-clamp-3 text-sm leading-6 text-muted-gray">
        {{ destination.description }}
      </p>

      <RouterLink
        class="mt-4 inline-flex items-center gap-2 rounded-full bg-deep-charcoal px-4 py-2.5 text-sm font-semibold text-white transition duration-300 hover:bg-nature-green"
        :to="destination.detailPath"
      >
        Detail
        <ArrowRight class="size-4" />
      </RouterLink>
    </div>
  </article>
</template>
