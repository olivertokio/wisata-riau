<script setup>
import { SlidersHorizontal } from 'lucide-vue-next'
import { mapCategories } from '../../data/locations'

defineProps({
  activeCategory: {
    type: String,
    default: 'Semua',
  },
})

const emit = defineEmits(['update:activeCategory'])
</script>

<template>
  <div class="map-reveal rounded-[1.75rem] border border-black/5 bg-white/80 p-3 shadow-[0_22px_60px_rgba(31,41,51,0.08)] backdrop-blur-2xl">
    <div class="mb-3 flex items-center gap-2 px-2 text-sm font-semibold text-deep-charcoal">
      <span class="grid size-9 place-items-center rounded-full bg-soft-cream text-nature-green">
        <SlidersHorizontal class="size-4" />
      </span>
      Pilih suasana
    </div>

    <div class="flex gap-2 overflow-x-auto pb-1 lg:flex-wrap">
      <button
        v-for="category in mapCategories"
        :key="category"
        class="shrink-0 rounded-full px-4 py-2.5 text-sm font-semibold transition duration-300"
        :class="activeCategory === category
          ? 'bg-deep-charcoal text-white shadow-lg shadow-green-950/10'
          : 'bg-soft-cream text-muted-gray hover:bg-white hover:text-deep-charcoal'"
        type="button"
        @click="emit('update:activeCategory', category)"
      >
        {{ category }}
      </button>
    </div>
  </div>
</template>
