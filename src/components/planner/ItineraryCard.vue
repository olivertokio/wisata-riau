<script setup>
import { Clock3, MoonStar, Sun, Sunset } from 'lucide-vue-next'

defineProps({
  day: {
    type: Object,
    required: true,
  },
})

const slotIcons = {
  pagi: Sun,
  siang: Clock3,
  sore: Sunset,
  malam: MoonStar,
}

const slotLabels = {
  pagi: 'Pagi',
  siang: 'Siang',
  sore: 'Sore',
  malam: 'Malam',
}
</script>

<template>
  <article
    data-planner-itinerary
    class="rounded-[1.25rem] border border-black/6 bg-[#FCFBF8] p-4 shadow-[0_14px_35px_rgba(31,41,51,0.05)]"
  >
    <div class="flex items-center justify-between gap-3">
      <div>
        <p class="text-[11px] font-semibold uppercase tracking-[0.18em] text-soft-gold">Hari {{ day.dayNumber }}</p>
        <h3 class="planner-display mt-1.5 text-[1.3rem] font-semibold text-deep-charcoal">{{ day.title }}</h3>
      </div>
      <div class="rounded-full bg-soft-cream px-3 py-1.5 text-xs font-semibold text-nature-green">
        {{ day.area }}
      </div>
    </div>

    <div class="mt-4 grid gap-2.5">
      <div
        v-for="slot in ['pagi', 'siang', 'sore', 'malam']"
        :key="slot"
        class="rounded-[1rem] bg-soft-cream/75 px-3.5 py-3.5"
      >
        <div class="flex items-start gap-3">
          <div class="grid size-9 shrink-0 place-items-center rounded-full bg-white text-nature-green shadow-sm">
            <component :is="slotIcons[slot]" class="size-3.5" />
          </div>
          <div>
            <p class="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-gray">{{ slotLabels[slot] }}</p>
            <p class="mt-1.5 text-sm font-semibold text-deep-charcoal">{{ day[slot].title }}</p>
            <p class="mt-1 text-sm leading-6 text-muted-gray">{{ day[slot].description }}</p>
          </div>
        </div>
      </div>
    </div>
  </article>
</template>
