<script setup>
defineProps({
  preferences: {
    type: Object,
    required: true,
  },
})
</script>

<template>
  <section data-profile-preferences class="rounded-[2rem] border border-black/6 bg-white/96 p-6 shadow-[0_22px_55px_rgba(31,41,51,0.06)] sm:p-7">
    <div class="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p class="text-sm font-semibold uppercase tracking-[0.22em] text-soft-gold">Preferensi Personal</p>
        <h2 class="planner-display mt-3 text-3xl font-semibold text-deep-charcoal sm:text-4xl">Cara traveler membaca perjalanan</h2>
      </div>
      <p class="max-w-xl text-sm leading-7 text-muted-gray sm:text-right">
        Preferensi ini membantu membentuk ritme itinerary, cara eksplorasi, dan destinasi yang paling relevan untuk profile traveler.
      </p>
    </div>

    <div class="mt-8 grid gap-5 lg:grid-cols-3">
      <div data-profile-preference class="rounded-[1.4rem] bg-soft-cream/55 p-5">
        <p class="text-xs font-semibold uppercase tracking-[0.18em] text-muted-gray">Kategori favorit</p>
        <div class="mt-4 flex flex-wrap gap-2">
          <span
            v-for="item in preferences.categories"
            :key="item"
            class="rounded-full border border-nature-green/14 bg-white px-3 py-2 text-sm font-semibold text-deep-charcoal"
          >
            {{ item }}
          </span>
        </div>
      </div>

      <div data-profile-preference class="rounded-[1.4rem] bg-soft-cream/55 p-5">
        <p class="text-xs font-semibold uppercase tracking-[0.18em] text-muted-gray">Tipe perjalanan favorit</p>
        <div class="mt-4 flex flex-wrap gap-2">
          <span
            v-for="item in preferences.tripTypes"
            :key="item"
            class="rounded-full border border-soft-gold/18 bg-white px-3 py-2 text-sm font-semibold text-deep-charcoal"
          >
            {{ item }}
          </span>
        </div>
      </div>

      <div data-profile-preference class="rounded-[1.4rem] bg-soft-cream/55 p-5">
        <p class="text-xs font-semibold uppercase tracking-[0.18em] text-muted-gray">Budget favorit</p>
        <div class="mt-4 flex flex-wrap gap-2">
          <span
            v-for="item in preferences.budgets"
            :key="item"
            class="rounded-full border border-black/8 bg-white px-3 py-2 text-sm font-semibold text-deep-charcoal"
          >
            {{ item }}
          </span>
        </div>
      </div>
    </div>
  </section>
</template>
