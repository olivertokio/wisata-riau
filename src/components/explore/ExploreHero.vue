<script setup>
import { Search, Star } from 'lucide-vue-next'
import { computed } from 'vue'

const props = defineProps({
  heroImage: {
    type: String,
    default: '',
  },
  query: {
    type: String,
    default: '',
  },
  stats: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['update:query'])

const heroStyle = computed(() => ({
  backgroundImage: `linear-gradient(110deg, rgba(12, 22, 19, 0.82) 0%, rgba(12, 22, 19, 0.58) 38%, rgba(12, 22, 19, 0.2) 68%, rgba(12, 22, 19, 0.66) 100%), url(${props.heroImage})`,
}))

const statItems = computed(() => [
  {
    label: 'total destinasi',
    value: String(props.stats.totalDestinations).padStart(2, '0'),
  },
  {
    label: 'kategori pilihan',
    value: String(props.stats.totalCategories).padStart(2, '0'),
  },
  {
    label: 'rating rata-rata',
    value: props.stats.averageRating,
  },
])

function handleInput(event) {
  emit('update:query', event.target.value)
}
</script>

<template>
  <header class="relative px-4 pt-28 sm:px-6 lg:px-10 lg:pt-32">
    <div
      class="relative mx-auto overflow-hidden rounded-[2.25rem] border border-white/40 shadow-[0_34px_120px_rgba(31,41,51,0.16)] ring-1 ring-black/5 sm:rounded-[2.8rem]"
      :style="heroStyle"
    >
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(201,162,39,0.2),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(47,107,79,0.22),transparent_32%)]"></div>
      <div class="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/35 to-transparent"></div>

      <div class="relative mx-auto max-w-7xl px-5 py-10 text-white sm:px-8 sm:py-16 lg:px-12 lg:py-20">
        <div class="grid gap-10 lg:grid-cols-[minmax(0,1fr)_23rem] lg:items-end">
          <div>
            <p
              data-explore-hero
              class="inline-flex items-center gap-2 rounded-full border border-white/18 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-soft-gold backdrop-blur-xl"
            >
              <Star class="size-3.5 fill-soft-gold text-soft-gold" />
              Direktori Wisata Riau
            </p>

            <h1
              data-explore-hero
              class="planner-display mt-6 max-w-4xl text-3xl font-semibold leading-[1.02] text-white sm:text-5xl lg:text-7xl"
            >
              Temukan destinasi terbaik di seluruh Riau
            </h1>

            <p
              data-explore-hero
              class="mt-5 max-w-2xl text-base leading-7 text-white/74 sm:text-lg sm:leading-8"
            >
              Panduan visual untuk menjelajahi pesisir, warisan budaya, spot alam, dan pengalaman kuliner terbaik dari berbagai sudut Provinsi Riau.
            </p>

            <div
              data-explore-hero
              class="mt-8 max-w-2xl rounded-[1.75rem] border border-white/18 bg-white/12 p-3 shadow-[0_18px_45px_rgba(0,0,0,0.16)] backdrop-blur-2xl"
            >
              <div class="flex flex-col gap-3 rounded-[1.35rem] bg-white px-4 py-4 sm:flex-row sm:items-center sm:px-5">
                <div class="grid size-11 shrink-0 place-items-center rounded-full bg-soft-cream text-nature-green">
                  <Search class="size-5" />
                </div>

                <div class="min-w-0 flex-1">
                  <label class="sr-only" for="explore-search">Cari destinasi di Riau</label>
                  <input
                    id="explore-search"
                    :value="query"
                    class="w-full bg-transparent text-base font-medium text-deep-charcoal outline-none placeholder:text-muted-gray/80 sm:text-lg"
                    type="search"
                    placeholder="Cari pantai, budaya, air terjun, atau kota di Riau..."
                    @input="handleInput"
                  />
                </div>
              </div>
            </div>
          </div>

          <div class="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            <article
              v-for="item in statItems"
              :key="item.label"
              data-explore-hero
              class="rounded-[1.65rem] border border-white/18 bg-white/12 p-5 text-white shadow-[0_14px_40px_rgba(0,0,0,0.12)] backdrop-blur-xl"
            >
              <p class="text-xs font-semibold uppercase tracking-[0.22em] text-white/62">{{ item.label }}</p>
              <strong class="planner-display mt-3 block text-3xl font-semibold sm:text-4xl">{{ item.value }}</strong>
            </article>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>
