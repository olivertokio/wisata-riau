<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import FavoriteDestinations from '../components/profile/FavoriteDestinations.vue'
import ProfileHero from '../components/profile/ProfileHero.vue'
import ProfilePreferences from '../components/profile/ProfilePreferences.vue'
import ProfileStats from '../components/profile/ProfileStats.vue'
import TravelActivity from '../components/profile/TravelActivity.vue'
import { getDestinations } from '../services/destinationService'
import { getFavoriteIdsByUser } from '../services/favoriteService'
import { getTripPlansByUser } from '../services/tripPlanService'
import { requireSupabase } from '../services/supabase'
import { useUserStore } from '../stores/userStore'

gsap.registerPlugin(ScrollTrigger)

const profileRoot = ref(null)
const isEditing = ref(false)
const saveMessage = ref('')
const destinations = ref([])
const router = useRouter()
const userStore = useUserStore()
let ctx = null

const profile = reactive({
  name: 'Pengguna RiauScape',
  email: '',
  tagline: 'Menjelajahi Riau melalui pengalaman dan cerita.',
  totalReviews: 0,
  plannedTrips: 0,
  favoriteCategory: 'Wisata Riau',
  favoriteBudget: 'Standar',
})

const favoriteIds = ref([])

const favoriteDestinations = computed(() => {
  return favoriteIds.value
    .map((id) => destinations.value.find((item) => String(item.id) === String(id)))
    .filter(Boolean)
})

const heroImage = computed(() => {
  return favoriteDestinations.value[2]?.image || favoriteDestinations.value[0]?.image || destinations.value[0]?.image || ''
})

const heroStats = computed(() => [
  { label: 'Favorit', value: `${favoriteDestinations.value.length}` },
  { label: 'Ulasan', value: `${profile.totalReviews}` },
  { label: 'Perjalanan', value: `${profile.plannedTrips}` },
])

const summaryCards = computed(() => [
  {
    title: 'Destinasi favorit',
    value: `${favoriteDestinations.value.length}`,
    detail: 'destinasi yang disimpan untuk inspirasi perjalanan berikutnya.',
    icon: 'heart',
  },
  {
    title: 'Total ulasan',
    value: `${profile.totalReviews}`,
    detail: 'cerita perjalanan yang sudah dibagikan ke komunitas.',
    icon: 'review',
  },
  {
    title: 'Perjalanan direncanakan',
    value: `${profile.plannedTrips}`,
    detail: 'rencana itinerary yang sudah disusun sepanjang eksplorasi Riau.',
    icon: 'trip',
  },
  {
    title: 'Kategori favorit',
    value: 'Alam',
    detail: 'tema perjalanan yang paling sering dipilih saat menjelajah Riau.',
    icon: 'category',
  },
])

const activities = computed(() => [
  {
    type: 'Ulasan',
    title: `${profile.totalReviews} ulasan aktif`,
    description: 'Jumlah ulasan yang tersimpan dan terhubung dengan akun ini.',
    date: 'Akun saat ini',
  },
  {
    type: 'Favorit',
    title: `${favoriteDestinations.value.length} destinasi favorit`,
    description: 'Destinasi yang tersimpan sebagai inspirasi perjalanan berikutnya.',
    date: 'Koleksi personal',
  },
  {
    type: 'Planner',
    title: `${profile.plannedTrips} trip planner`,
    description: 'Rencana perjalanan yang dibuat melalui fitur Trip Planner.',
    date: 'Riwayat akun',
  },
])

const preferences = {
  categories: ['Alam', 'Budaya Melayu', 'Kuliner'],
  tripTypes: ['Perjalanan berdua', 'Slow travel', 'Photography trip'],
  budgets: ['Standar', 'Premium ringan'],
}

function handleUpdateField({ field, value }) {
  profile[field] = value
}

function handleStartEdit() {
  isEditing.value = true
  saveMessage.value = ''
}

function handleSave() {
  isEditing.value = false
  saveMessage.value = 'Perubahan profile tersimpan secara lokal untuk sesi ini.'

  window.setTimeout(() => {
    saveMessage.value = ''
  }, 2400)
}

async function loadProfileStats() {
  if (!userStore.user?.id) return

  profile.name = userStore.user.full_name || userStore.user.name || 'Pengguna RiauScape'
  profile.email = userStore.user.email || ''

  try {
    const supabase = requireSupabase()
    const { count } = await supabase
      .from('reviews')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userStore.user.id)
    profile.totalReviews = count || 0
  } catch {
    profile.totalReviews = 0
  }

  try {
    const trips = await getTripPlansByUser(userStore.user.id)
    profile.plannedTrips = trips.length
  } catch {
    profile.plannedTrips = 0
  }

  try {
    favoriteIds.value = await getFavoriteIdsByUser(userStore.user.id)
  } catch {
    favoriteIds.value = []
  }
}

async function handleLogout() {
  await userStore.logout()
  router.push('/')
}

function animateProfilePage() {
  ctx?.revert()

  if (!profileRoot.value) {
    return
  }

  ctx = gsap.context(() => {
    gsap.from('[data-profile-hero]', {
      y: 18,
      duration: 0.72,
      ease: 'power3.out',
      clearProps: 'transform',
    })

    gsap.to('[data-profile-hero-media]', {
      yPercent: 8,
      ease: 'none',
      scrollTrigger: {
        trigger: profileRoot.value.querySelector('[data-profile-hero]'),
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      },
    })

    gsap.from('[data-profile-stat]', {
      y: 14,
      duration: 0.58,
      stagger: 0.08,
      ease: 'power3.out',
      delay: 0.12,
      clearProps: 'transform',
    })

    gsap.from('[data-profile-favorites]', {
      y: 14,
      duration: 0.56,
      ease: 'power3.out',
      delay: 0.2,
      clearProps: 'transform',
    })

    gsap.from('[data-profile-favorite-card]', {
      y: 16,
      duration: 0.62,
      stagger: 0.1,
      ease: 'power3.out',
      delay: 0.26,
      clearProps: 'transform',
    })

    gsap.from('[data-profile-activity]', {
      y: 14,
      duration: 0.56,
      ease: 'power3.out',
      delay: 0.32,
      clearProps: 'transform',
    })

    gsap.from('[data-profile-activity-item]', {
      y: 16,
      duration: 0.58,
      stagger: 0.08,
      ease: 'power3.out',
      delay: 0.4,
      clearProps: 'transform',
    })

    gsap.from('[data-profile-preferences]', {
      y: 14,
      duration: 0.56,
      ease: 'power3.out',
      delay: 0.36,
      clearProps: 'transform',
    })

    gsap.from('[data-profile-preference]', {
      y: 14,
      duration: 0.56,
      stagger: 0.08,
      ease: 'power3.out',
      delay: 0.46,
      clearProps: 'transform',
    })
  }, profileRoot.value)
}

onMounted(async () => {
  await userStore.initialize()
  destinations.value = await getDestinations()
  await loadProfileStats()
  await nextTick()
  animateProfilePage()
})

onBeforeUnmount(() => {
  ctx?.revert()
})
</script>

<template>
  <section
    ref="profileRoot"
    class="planner-sans relative overflow-hidden bg-[linear-gradient(180deg,#FDFCF8_0%,#F8F4EC_26%,#FDFCF8_100%)] px-4 pb-24 pt-28 sm:px-6 sm:pt-32 lg:px-10"
  >
    <div class="pointer-events-none absolute inset-x-0 top-0 h-[28rem] bg-[radial-gradient(circle_at_top_right,rgba(201,162,39,0.14),transparent_30%),radial-gradient(circle_at_top_left,rgba(47,107,79,0.14),transparent_32%)]"></div>

    <div class="relative mx-auto max-w-7xl space-y-8">
      <ProfileHero
        :profile="profile"
        :hero-image="heroImage"
        :stats="heroStats"
        :is-editing="isEditing"
        @start-edit="handleStartEdit"
        @save="handleSave"
        @update-field="handleUpdateField"
      />

      <Transition
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="translate-y-3 opacity-0"
        enter-to-class="translate-y-0 opacity-100"
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="translate-y-0 opacity-100"
        leave-to-class="-translate-y-3 opacity-0"
      >
        <div
          v-if="saveMessage"
          class="rounded-[1.4rem] border border-nature-green/12 bg-[linear-gradient(135deg,rgba(47,107,79,0.08),rgba(201,162,39,0.08))] px-5 py-4 text-sm font-medium text-deep-charcoal shadow-sm"
        >
          {{ saveMessage }}
        </div>
      </Transition>

      <ProfileStats :items="summaryCards" />

      <div class="flex justify-end">
        <button
          class="rounded-full bg-deep-charcoal px-5 py-3 text-sm font-semibold text-white transition hover:bg-nature-green"
          type="button"
          @click="handleLogout"
        >
          Logout
        </button>
      </div>

      <FavoriteDestinations :destinations="favoriteDestinations" />

      <div class="grid gap-8 xl:grid-cols-[1.05fr_0.95fr]">
        <TravelActivity :activities="activities" />
        <ProfilePreferences :preferences="preferences" />
      </div>
    </div>
  </section>
</template>
