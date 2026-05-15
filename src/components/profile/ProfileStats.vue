<script setup>
import { Heart, Landmark, MessageSquareText, Route } from 'lucide-vue-next'

const props = defineProps({
  items: {
    type: Array,
    default: () => [],
  },
})

const iconMap = {
  heart: Heart,
  review: MessageSquareText,
  trip: Route,
  category: Landmark,
}

function resolveIcon(name) {
  return iconMap[name] || Heart
}
</script>

<template>
  <section data-profile-stats class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
    <article
      v-for="item in items"
      :key="item.title"
      data-profile-stat
      class="group rounded-[1.75rem] border border-black/6 bg-white/96 p-5 shadow-[0_18px_45px_rgba(31,41,51,0.06)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_55px_rgba(31,41,51,0.08)]"
    >
      <div class="flex items-start justify-between gap-3">
        <div>
          <p class="text-xs font-semibold uppercase tracking-[0.18em] text-soft-gold">{{ item.title }}</p>
          <p class="mt-3 planner-display text-3xl font-semibold text-deep-charcoal">{{ item.value }}</p>
        </div>
        <div class="grid size-11 place-items-center rounded-full bg-soft-cream text-nature-green">
          <component :is="resolveIcon(item.icon)" class="size-5" />
        </div>
      </div>
      <p class="mt-4 text-sm leading-7 text-muted-gray">{{ item.detail }}</p>
    </article>
  </section>
</template>
