<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import FavoriteDestinations from '../components/profile/FavoriteDestinations.vue'
import ProfileHero from '../components/profile/ProfileHero.vue'
import ProfilePreferences from '../components/profile/ProfilePreferences.vue'
import ProfileStats from '../components/profile/ProfileStats.vue'
import TravelActivity from '../components/profile/TravelActivity.vue'
import { destinations } from '../data/dummyData'

gsap.registerPlugin(ScrollTrigger)

const profileRoot = ref(null)
const isEditing = ref(false)
const saveMessage = ref('')
let ctx = null

const profile = reactive({
  name: 'Shandi Reskiawan',
  email: 'shandi@eksplorasiriau.id',
  tagline: 'Menjelajahi Riau melalui pengalaman dan cerita.',
  totalReviews: 8,
  plannedTrips: 5,
  favoriteCategory: 'Sejarah & Budaya',
  favoriteBudget: 'Standar ke Premium',
})

const favoriteIds = [4, 1, 3]

const favoriteDestinations = computed(() => {
  return favoriteIds
    .map((id) => destinations.find((item) => item.id === id))
    .filter(Boolean)
})

const heroImage = computed(() => {
  return favoriteDestinations.value[2]?.image || favoriteDestinations.value[0]?.image || destinations[0]?.image
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

const activities = [
  {
    type: 'Ulasan',
    title: 'Mengulas Istana Siak Sri Indrapura',
    description: 'Membagikan cerita tentang arsitektur istana, suasana heritage, dan pengalaman berjalan di kompleks Kesultanan Siak.',
    date: '2 hari lalu',
  },
  {
    type: 'Favorit',
    title: 'Menyimpan Pulau Jemur ke koleksi personal',
    description: 'Menandai destinasi bahari ini sebagai pilihan utama untuk perjalanan santai dengan fokus lanskap pesisir Riau.',
    date: 'Minggu ini',
  },
  {
    type: 'Planner',
    title: 'Membuat itinerary eksplorasi Kampar',
    description: 'Menyusun rencana multi-hari yang menggabungkan Ulu Kasok, Candi Muara Takus, dan wisata kuliner lokal.',
    date: 'Bulan ini',
  },
]

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

      <FavoriteDestinations :destinations="favoriteDestinations" />

      <div class="grid gap-8 xl:grid-cols-[1.05fr_0.95fr]">
        <TravelActivity :activities="activities" />
        <ProfilePreferences :preferences="preferences" />
      </div>
    </div>
  </section>
</template>
