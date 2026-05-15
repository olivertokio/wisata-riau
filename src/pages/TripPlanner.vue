<script setup>
import { LoaderCircle } from 'lucide-vue-next'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import PlannerForm from '../components/planner/PlannerForm.vue'
import PlannerResult from '../components/planner/PlannerResult.vue'
import {
  accommodationRecommendations,
  culinaryRecommendations,
  plannerFallbackDestinations,
} from '../data/plannerData'
import { destinations } from '../data/dummyData'

gsap.registerPlugin(ScrollTrigger)

const plannerRoot = ref(null)
const resultSection = ref(null)
const loading = ref(false)
const plannerResult = ref(null)
let loadingTimer = null
let ctx = null

const topRatedDestinations = computed(() => {
  return [...destinations].sort((left, right) => right.rating - left.rating)
})

function normalizeArea(area) {
  if (area === 'Semua Riau') {
    return area
  }

  return area.toLowerCase()
}

function pickDestinations(preferences) {
  const normalizedArea = normalizeArea(preferences.area)
  const sameCategory = destinations.filter((item) => item.category === preferences.category)
  const sameArea = sameCategory.filter((item) => normalizedArea === 'semua riau' || item.location.toLowerCase() === normalizedArea)

  const basePool = sameArea.length
    ? sameArea
    : sameCategory.length
      ? sameCategory
      : topRatedDestinations.value

  const merged = [...basePool]

  topRatedDestinations.value.forEach((item) => {
    if (!merged.find((existing) => existing.id === item.id)) {
      merged.push(item)
    }
  })

  plannerFallbackDestinations.forEach((item) => {
    if (!merged.find((existing) => existing.id === item.id)) {
      merged.push(item)
    }
  })

  return merged.slice(0, Math.max(preferences.duration + 2, 4))
}

function pickCulinary(preferences) {
  if (!preferences.includeCulinary) {
    return []
  }

  const offset = preferences.budget === 'Premium' ? 2 : preferences.budget === 'Standar' ? 1 : 0
  return culinaryRecommendations.slice(offset, offset + 4)
}

function pickStays(preferences) {
  if (!preferences.includeStay || preferences.duration <= 1) {
    return []
  }

  const pool = accommodationRecommendations[preferences.budget] || []

  if (preferences.area === 'Semua Riau') {
    return pool.slice(0, 2)
  }

  const matchingArea = pool.filter((stay) => stay.area === preferences.area)
  return (matchingArea.length ? matchingArea : pool).slice(0, 2)
}

function createItinerary(preferences, recommendedDestinations, culinary, stays) {
  return Array.from({ length: preferences.duration }, (_, index) => {
    const morning = recommendedDestinations[index % recommendedDestinations.length]
    const afternoon = recommendedDestinations[(index + 1) % recommendedDestinations.length]
    const evening = recommendedDestinations[(index + 2) % recommendedDestinations.length]
    const culinaryItem = culinary[index % Math.max(culinary.length, 1)] || 'Eksplorasi kuliner lokal khas Riau'
    const stay = stays[index % Math.max(stays.length, 1)]

    return {
      dayNumber: index + 1,
      title: `Eksplorasi ${preferences.area === 'Semua Riau' ? 'Riau' : preferences.area}`,
      area: preferences.area,
      pagi: {
        title: `Mulai hari di ${morning.name}`,
        description: `Nikmati suasana ${morning.category.toLowerCase()} dengan waktu kunjungan terbaik pada pagi hari dan ritme perjalanan yang lebih tenang.`,
      },
      siang: {
        title: `Cicipi ${culinaryItem}`,
        description: preferences.includeCulinary
          ? `Sisipkan agenda kuliner lokal untuk memberi jeda nyaman sebelum lanjut ke sesi siang.`
          : `Gunakan sesi siang untuk makan santai di area sekitar ${morning.location}.`,
      },
      sore: {
        title: `Lanjut ke ${afternoon.name}`,
        description: `Sore hari diarahkan ke destinasi dengan karakter visual kuat agar itinerary tetap terasa dinamis namun tidak terburu-buru.`,
      },
      malam: {
        title: stay ? `Check-in di ${stay.name}` : `Tutup hari di ${evening.name}`,
        description: stay
          ? `${stay.note}`
          : `Akhiri hari dengan suasana santai atau wisata malam ringan di sekitar ${evening.location}.`,
      },
    }
  })
}

function createPlannerNote(preferences, recommendedDestinations) {
  return `Rencana ini memprioritaskan nuansa ${preferences.category.toLowerCase()} di area ${preferences.area}, dengan tempo perjalanan ${preferences.duration} hari untuk ${preferences.tripType.toLowerCase()}. Sistem memilih destinasi dengan rating terbaik seperti ${recommendedDestinations[0]?.name || 'pilihan populer Riau'} agar perjalanan terasa lebih efisien dan berkesan.`
}

function generatePlannerResult(preferences) {
  const recommendedDestinations = pickDestinations(preferences)
  const culinary = pickCulinary(preferences)
  const stays = pickStays(preferences)

  return {
    preferences,
    destinations: recommendedDestinations,
    culinary,
    stays,
    itinerary: createItinerary(preferences, recommendedDestinations, culinary, stays),
    note: createPlannerNote(preferences, recommendedDestinations),
  }
}

function animatePage() {
  ctx?.revert()

  if (!plannerRoot.value) {
    return
  }

  ctx = gsap.context(() => {
    gsap.from('[data-planner-form]', {
      y: 30,
      opacity: 0,
      duration: 0.85,
      stagger: 0.08,
      ease: 'power3.out',
    })

    if (plannerResult.value) {
      gsap.from('[data-planner-result]', {
        y: 26,
        opacity: 0,
        duration: 0.82,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: plannerRoot.value.querySelector('[data-planner-result]'),
          start: 'top 86%',
          once: true,
        },
      })

      gsap.from('[data-planner-itinerary]', {
        y: 24,
        opacity: 0,
        duration: 0.76,
        stagger: 0.08,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: plannerRoot.value.querySelector('[data-planner-itinerary]'),
          start: 'top 88%',
          once: true,
        },
      })

      gsap.from('[data-planner-map]', {
        y: 24,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: plannerRoot.value.querySelector('[data-planner-map]'),
          start: 'top 88%',
          once: true,
        },
      })
    }
  }, plannerRoot.value)
}

async function scrollToResult() {
  await nextTick()

  if (!resultSection.value) {
    return
  }

  resultSection.value.scrollIntoView({
    behavior: 'smooth',
    block: 'start',
  })
}

function handleSubmit(preferences) {
  loading.value = true
  plannerResult.value = null
  window.clearTimeout(loadingTimer)

  loadingTimer = window.setTimeout(async () => {
    plannerResult.value = generatePlannerResult(preferences)
    loading.value = false
    await nextTick()
    animatePage()
    scrollToResult()
  }, 1500)
}

onMounted(async () => {
  await nextTick()
  animatePage()
})

watch(plannerResult, async () => {
  await nextTick()
  animatePage()
})

onBeforeUnmount(() => {
  window.clearTimeout(loadingTimer)
  ctx?.revert()
})
</script>

<template>
  <section
    ref="plannerRoot"
    class="relative overflow-hidden bg-[#F6F5F1] pt-[5.95rem] sm:pt-[6.4rem]"
  >
    <div class="pointer-events-none absolute inset-x-0 top-0 h-[28rem] bg-[radial-gradient(circle_at_top_right,rgba(201,162,39,0.08),transparent_22%),radial-gradient(circle_at_top_left,rgba(47,107,79,0.08),transparent_24%)]"></div>

    <div class="relative">
      <PlannerForm :loading="loading" @submit="handleSubmit" />

      <Transition
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="translate-y-3 opacity-0"
        enter-to-class="translate-y-0 opacity-100"
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="translate-y-0 opacity-100"
        leave-to-class="-translate-y-3 opacity-0"
      >
        <div
          v-if="loading"
          class="planner-sans mx-auto mt-10 max-w-2xl rounded-[1.3rem] border border-white/80 bg-white/92 p-6 text-center shadow-[0_20px_60px_rgba(31,41,51,0.07)] ring-1 ring-black/5 backdrop-blur"
        >
          <div class="mx-auto grid size-14 place-items-center rounded-full bg-soft-cream text-nature-green">
            <LoaderCircle class="size-6 animate-spin" />
          </div>
          <p class="mt-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-soft-gold">Planner Sedang Bekerja</p>
          <h2 class="planner-display mt-3 text-[1.7rem] font-semibold text-deep-charcoal">Menyusun rencana perjalanan terbaik untukmu...</h2>
          <p class="mt-2.5 text-sm leading-7 text-muted-gray">
            Sistem sedang menyesuaikan destinasi, ritme harian, kuliner, dan penginapan agar itinerary terasa lebih personal.
          </p>
        </div>
      </Transition>

      <div v-if="plannerResult && !loading" ref="resultSection">
        <PlannerResult :result="plannerResult" />
      </div>

      <div class="planner-sans flex flex-col gap-4 border-t border-black/10 bg-[#F1F0EC] px-6 py-5 text-sm text-muted-gray sm:flex-row sm:items-center sm:justify-between lg:px-12">
        <p class="text-deep-charcoal">
          <span class="font-semibold">Eksplorasi Riau</span>
          <span class="ml-2 text-muted-gray/80">&copy; 2026 Arsitek Perjalanan.</span>
        </p>
        <div class="flex flex-wrap items-center gap-6">
          <span>Kebijakan Privasi</span>
          <span>Syarat &amp; Ketentuan</span>
          <span>Bantuan</span>
        </div>
      </div>
    </div>
  </section>
</template>
