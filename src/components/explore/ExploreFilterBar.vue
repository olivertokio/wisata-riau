<script setup>
import { ListFilter, MapPinned, RotateCcw } from 'lucide-vue-next'

defineProps({
  categories: {
    type: Array,
    required: true,
  },
  locations: {
    type: Array,
    required: true,
  },
  quickChips: {
    type: Array,
    required: true,
  },
  selectedCategory: {
    type: String,
    required: true,
  },
  selectedLocation: {
    type: String,
    required: true,
  },
  resultsCount: {
    type: Number,
    required: true,
  },
})

const emit = defineEmits(['update:selectedCategory', 'update:selectedLocation', 'reset'])

function updateCategory(event) {
  emit('update:selectedCategory', event.target.value)
}

function updateLocation(event) {
  emit('update:selectedLocation', event.target.value)
}

function selectQuickChip(category) {
  emit('update:selectedCategory', category)
}
</script>

<template>
  <div class="mx-auto mt-8 max-w-7xl px-4 sm:px-6 lg:px-10">
    <div
      data-explore-filter
      class="sticky top-[5.6rem] z-30 overflow-hidden rounded-[2rem] border border-white/70 bg-white/80 p-4 shadow-[0_18px_55px_rgba(31,41,51,0.08)] ring-1 ring-black/5 backdrop-blur-2xl sm:p-5"
    >
      <div class="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <p class="text-sm font-semibold uppercase tracking-[0.2em] text-soft-gold">Filter Direktori</p>
          <p class="mt-2 text-sm text-muted-gray sm:text-base">
            Menampilkan {{ resultsCount }} destinasi untuk inspirasi perjalanan di Provinsi Riau.
          </p>
        </div>

        <button
          class="inline-flex w-fit items-center gap-2 rounded-full border border-black/8 bg-soft-cream px-4 py-2.5 text-sm font-semibold text-deep-charcoal transition duration-300 hover:-translate-y-0.5 hover:border-soft-gold/40 hover:bg-white"
          type="button"
          @click="$emit('reset')"
        >
          <RotateCcw class="size-4" />
          Reset Filter
        </button>
      </div>

      <div class="mt-5 flex gap-3 overflow-x-auto pb-1">
        <button
          v-for="chip in quickChips"
          :key="chip"
          class="shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition duration-300"
          :class="chip === selectedCategory
            ? 'border-nature-green bg-nature-green text-white shadow-[0_12px_35px_rgba(47,107,79,0.24)]'
            : 'border-black/8 bg-white text-muted-gray hover:border-soft-gold/40 hover:text-deep-charcoal'"
          type="button"
          @click="selectQuickChip(chip)"
        >
          {{ chip }}
        </button>
      </div>

      <div class="mt-5 grid gap-3 lg:grid-cols-[1fr_1fr]">
        <label class="block">
          <span class="mb-2 flex items-center gap-2 px-1 text-sm font-semibold text-muted-gray">
            <ListFilter class="size-4 text-nature-green" />
            Kategori
          </span>
          <select
            :value="selectedCategory"
            class="w-full rounded-[1.35rem] border border-black/8 bg-soft-cream px-4 py-3.5 text-deep-charcoal outline-none transition focus:border-soft-gold/40 focus:ring-4 focus:ring-soft-gold/15"
            @change="updateCategory"
          >
            <option v-for="category in categories" :key="category" :value="category">{{ category }}</option>
          </select>
        </label>

        <label class="block">
          <span class="mb-2 flex items-center gap-2 px-1 text-sm font-semibold text-muted-gray">
            <MapPinned class="size-4 text-nature-green" />
            Lokasi
          </span>
          <select
            :value="selectedLocation"
            class="w-full rounded-[1.35rem] border border-black/8 bg-soft-cream px-4 py-3.5 text-deep-charcoal outline-none transition focus:border-soft-gold/40 focus:ring-4 focus:ring-soft-gold/15"
            @change="updateLocation"
          >
            <option v-for="location in locations" :key="location" :value="location">{{ location }}</option>
          </select>
        </label>
      </div>
    </div>
  </div>
</template>
