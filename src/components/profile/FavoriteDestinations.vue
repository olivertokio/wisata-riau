<script setup>
import { ArrowRight, MapPin, Star } from 'lucide-vue-next'

defineProps({
  destinations: {
    type: Array,
    default: () => [],
  },
})
</script>

<template>
  <section data-profile-favorites class="rounded-[2rem] border border-black/6 bg-white/96 p-6 shadow-[0_22px_55px_rgba(31,41,51,0.06)] sm:p-7">
    <div class="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p class="text-sm font-semibold uppercase tracking-[0.22em] text-soft-gold">Destinasi Favorit</p>
        <h2 class="planner-display mt-3 text-3xl font-semibold text-deep-charcoal sm:text-4xl">Tempat yang paling ingin dikunjungi lagi</h2>
      </div>
      <p class="max-w-xl text-sm leading-7 text-muted-gray sm:text-right">
        Disimpan sebagai koleksi perjalanan personal untuk inspirasi perjalanan berikutnya di Riau.
      </p>
    </div>

    <div class="mt-8 grid gap-4">
      <article
        v-for="destination in destinations"
        :key="destination.id"
        data-profile-favorite-card
        class="group overflow-hidden rounded-[1.6rem] border border-black/6 bg-soft-cream/50 transition duration-300 hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_16px_40px_rgba(31,41,51,0.06)]"
      >
        <div class="grid gap-0 md:grid-cols-[19rem_1fr]">
          <div class="relative min-h-[15rem] overflow-hidden">
            <img
              :src="destination.image"
              :alt="destination.name"
              class="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
            />
            <div class="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.02)_0%,rgba(0,0,0,0.3)_100%)]"></div>
            <div class="absolute left-4 top-4 rounded-full border border-white/18 bg-white/14 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-white backdrop-blur-xl">
              {{ destination.category }}
            </div>
          </div>

          <div class="flex flex-col justify-between p-5 sm:p-6">
            <div>
              <div class="flex flex-wrap items-center gap-3">
                <span class="inline-flex items-center gap-2 rounded-full bg-premium-white px-3 py-1.5 text-xs font-semibold text-nature-green">
                  <Star class="size-3.5 fill-soft-gold text-soft-gold" />
                  {{ destination.rating }} rating
                </span>
                <span class="inline-flex items-center gap-2 text-sm font-medium text-muted-gray">
                  <MapPin class="size-4 text-soft-gold" />
                  {{ destination.location }}
                </span>
              </div>

              <h3 class="planner-display mt-4 text-3xl font-semibold text-deep-charcoal">
                {{ destination.name }}
              </h3>
              <p class="mt-4 max-w-2xl text-sm leading-7 text-muted-gray">
                {{ destination.description }}
              </p>
            </div>

            <div class="mt-6">
              <RouterLink
                :to="`/destination/${destination.id}`"
                class="inline-flex items-center gap-2 rounded-full bg-deep-charcoal px-5 py-3 text-sm font-semibold text-white transition duration-300 hover:-translate-y-0.5 hover:bg-nature-green"
              >
                Lihat detail
                <ArrowRight class="size-4" />
              </RouterLink>
            </div>
          </div>
        </div>
      </article>
    </div>
  </section>
</template>
