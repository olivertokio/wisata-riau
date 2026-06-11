<script setup>
import { Heart } from 'lucide-vue-next'
import { computed, onMounted, ref } from 'vue'
import DestinationDirectoryCard from '../components/explore/DestinationDirectoryCard.vue'
import { getDestinations } from '../services/destinationService'
import { getFavoriteIdsByUser } from '../services/favoriteService'
import { useUserStore } from '../stores/userStore'

const userStore = useUserStore()
const destinations = ref([])
const favoriteIds = ref([])

const favoriteDestinations = computed(() => {
  return destinations.value.filter((destination) => (
    favoriteIds.value.some((id) => String(id) === String(destination.id))
  ))
})

async function loadFavorites() {
  if (!userStore.user?.id) {
    favoriteIds.value = []
    return
  }

  try {
    favoriteIds.value = await getFavoriteIdsByUser(userStore.user.id)
  } catch {
    favoriteIds.value = []
  }
}

onMounted(async () => {
  await userStore.initialize()
  destinations.value = await getDestinations()
  await loadFavorites()
})
</script>

<template>
  <section class="mx-auto max-w-7xl px-4 pb-20 pt-32 sm:px-6 lg:px-10">
    <div>
      <p class="text-sm font-semibold uppercase tracking-[0.22em] text-soft-gold">Favorit</p>
      <h1 class="planner-display mt-3 text-4xl font-semibold text-deep-charcoal sm:text-5xl">Destinasi favorit</h1>
      <p class="mt-4 max-w-2xl leading-8 text-muted-gray">Koleksi destinasi yang kamu simpan saat menjelajahi RiauScape.</p>
    </div>

    <div v-if="favoriteDestinations.length" class="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      <DestinationDirectoryCard
        v-for="destination in favoriteDestinations"
        :key="destination.id"
        :destination="destination"
      />
    </div>

    <div v-else class="mt-10 rounded-[2rem] border border-black/8 bg-white p-8 text-center shadow-sm">
      <div class="mx-auto grid size-14 place-items-center rounded-full bg-soft-cream text-nature-green">
        <Heart class="size-6" />
      </div>
      <h2 class="mt-5 text-2xl font-semibold text-deep-charcoal">Belum ada destinasi favorit.</h2>
      <p class="mt-2 text-muted-gray">Buka detail destinasi lalu klik Simpan Favorit.</p>
      <RouterLink class="mt-6 inline-flex rounded-full bg-nature-green px-6 py-3 font-semibold text-white" to="/explore">
        Jelajahi destinasi
      </RouterLink>
    </div>
  </section>
</template>
