<script setup>
import { SearchX } from 'lucide-vue-next'
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import DestinationDirectoryCard from '../components/explore/DestinationDirectoryCard.vue'
import ExploreFilterBar from '../components/explore/ExploreFilterBar.vue'
import ExploreHero from '../components/explore/ExploreHero.vue'
import FeaturedRecommendation from '../components/explore/FeaturedRecommendation.vue'
import { destinations } from '../data/dummyData'
import { animateExploreCards, createExploreReveal } from '../gsap/exploreReveal'

const route = useRoute()
const exploreRoot = ref(null)
const query = ref('')
const selectedCategory = ref(route.query.category || 'Semua')
const selectedLocation = ref('Semua')

const categoryQuickChips = ['Semua', 'Alam', 'Budaya', 'Bahari', 'Kuliner', 'Sejarah']
let revealContext
let cardsTween

const categories = computed(() => ['Semua', ...new Set([...categoryQuickChips.slice(1), ...destinations.map((destination) => destination.category)])])
const locations = computed(() => ['Semua', ...new Set(destinations.map((destination) => destination.location))])

const filteredDestinations = computed(() => {
  const keyword = query.value.trim().toLowerCase()

  return destinations.filter((destination) => {
    const matchesKeyword = !keyword || [destination.name, destination.category, destination.location]
      .join(' ')
      .toLowerCase()
      .includes(keyword)
    const matchesCategory = selectedCategory.value === 'Semua' || destination.category === selectedCategory.value
    const matchesLocation = selectedLocation.value === 'Semua' || destination.location === selectedLocation.value

    return matchesKeyword && matchesCategory && matchesLocation
  })
})

const sortedDestinations = computed(() => {
  return [...destinations].sort((left, right) => {
    if (right.rating !== left.rating) {
      return right.rating - left.rating
    }

    return left.name.localeCompare(right.name)
  })
})

const featuredDestination = computed(() => sortedDestinations.value[0] || null)
const supportingRecommendations = computed(() => sortedDestinations.value.slice(1, 4))

const averageRating = computed(() => {
  const total = destinations.reduce((sum, destination) => sum + destination.rating, 0)
  return destinations.length ? (total / destinations.length).toFixed(1) : '0.0'
})

const heroStats = computed(() => ({
  totalDestinations: destinations.length,
  totalCategories: categories.value.length - 1,
  averageRating: averageRating.value,
}))

function resetFilters() {
  query.value = ''
  selectedCategory.value = 'Semua'
  selectedLocation.value = 'Semua'
}

function animateCards() {
  cardsTween?.kill?.()
  cardsTween = animateExploreCards(exploreRoot.value)
}

onMounted(async () => {
  revealContext = createExploreReveal(exploreRoot.value)
  await nextTick()
  animateCards()
})

watch(filteredDestinations, async () => {
  await nextTick()
  animateCards()
})

onBeforeUnmount(() => {
  cardsTween?.kill?.()
  revealContext?.revert?.()
})
</script>

<template>
  <section
    ref="exploreRoot"
    class="relative overflow-hidden bg-[linear-gradient(180deg,#FDFCF8_0%,#F9F6EF_24%,#FDFCF8_100%)] pb-20"
  >
    <div class="pointer-events-none absolute inset-x-0 top-0 h-[28rem] bg-[radial-gradient(circle_at_top_right,rgba(201,162,39,0.14),transparent_32%),radial-gradient(circle_at_top_left,rgba(47,107,79,0.14),transparent_30%)]"></div>

    <ExploreHero
      :hero-image="featuredDestination?.image"
      :query="query"
      :stats="heroStats"
      @update:query="query = $event"
    />

    <ExploreFilterBar
      :categories="categories"
      :locations="locations"
      :quick-chips="categoryQuickChips"
      :results-count="filteredDestinations.length"
      :selected-category="selectedCategory"
      :selected-location="selectedLocation"
      @reset="resetFilters"
      @update:selected-category="selectedCategory = $event"
      @update:selected-location="selectedLocation = $event"
    />

    <div class="mx-auto mt-10 max-w-7xl px-4 sm:px-6 lg:px-10">
      <div class="grid gap-8 xl:grid-cols-[minmax(0,1fr)_21rem] xl:items-start">
        <div class="order-2 xl:order-1">
          <div class="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div data-explore-section>
              <p class="text-sm font-semibold uppercase tracking-[0.22em] text-soft-gold">Pilihan Destinasi</p>
              <h2 class="mt-3 font-serif text-3xl font-semibold leading-tight text-deep-charcoal sm:text-4xl">
                Jelajahi lanskap alam, budaya, dan cerita khas Riau.
              </h2>
            </div>

            <div data-explore-section class="rounded-full border border-black/5 bg-white/80 px-4 py-2 text-sm font-medium text-muted-gray shadow-sm backdrop-blur">
              {{ filteredDestinations.length }} hasil siap dijelajahi
            </div>
          </div>

          <div
            v-if="filteredDestinations.length > 0"
            class="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3"
          >
            <DestinationDirectoryCard
              v-for="destination in filteredDestinations"
              :key="destination.id"
              :destination="destination"
            />
          </div>

          <div
            v-else
            data-explore-section
            class="mt-8 overflow-hidden rounded-[2rem] border border-white/80 bg-white/95 p-6 shadow-[0_28px_80px_rgba(31,41,51,0.08)] ring-1 ring-black/5 backdrop-blur sm:p-8"
          >
            <div class="grid gap-6 md:grid-cols-[auto_1fr] md:items-center">
              <div class="grid size-20 place-items-center rounded-[1.6rem] bg-soft-cream text-soft-gold shadow-inner shadow-white">
                <SearchX class="size-9" />
              </div>

              <div>
                <p class="text-sm font-semibold uppercase tracking-[0.22em] text-soft-gold">Belum Ada Hasil</p>
                <h3 class="mt-3 font-serif text-3xl font-semibold text-deep-charcoal">
                  Belum ada destinasi yang cocok dengan pencarianmu.
                </h3>
                <p class="mt-3 max-w-2xl leading-7 text-muted-gray">
                  Coba ganti keyword, pilih kategori lain, atau reset filter untuk melihat kembali seluruh direktori wisata terbaik di Provinsi Riau.
                </p>

                <button
                  class="mt-6 inline-flex items-center justify-center rounded-full bg-deep-charcoal px-5 py-3 text-sm font-semibold text-white transition duration-300 hover:-translate-y-0.5 hover:bg-nature-green"
                  type="button"
                  @click="resetFilters"
                >
                  Reset Pencarian
                </button>
              </div>
            </div>
          </div>
        </div>

        <FeaturedRecommendation
          :destinations="supportingRecommendations"
          :featured-destination="featuredDestination"
        />
      </div>
    </div>
  </section>
</template>
