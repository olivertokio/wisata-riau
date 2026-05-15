<script setup>
import {
  ArrowLeft,
  ArrowRight,
  Camera,
  Compass,
  Heart,
  MapPin,
  Navigation,
  Send,
  Share2,
  Sparkles,
  Star,
  Users,
} from 'lucide-vue-next'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import DestinationGallery from '../components/detail/DestinationGallery.vue'
import ReviewForm from '../components/forms/ReviewForm.vue'
import { destinations, reviews } from '../data/dummyData'

gsap.registerPlugin(ScrollTrigger)

const route = useRoute()
const detailRoot = ref(null)
let ctx

const destination = computed(() => {
  return destinations.find((item) => String(item.id) === String(route.params.id))
})

const destinationReviews = computed(() => {
  return reviews.filter((review) => String(review.destinationId) === String(route.params.id))
})

const hasCoordinates = computed(() => {
  return destination.value?.latitude != null && destination.value?.longitude != null
})

const mapLink = computed(() => {
  if (!hasCoordinates.value) {
    return '#'
  }

  return `https://www.google.com/maps?q=${destination.value.latitude},${destination.value.longitude}`
})

const heroImageStyle = computed(() => ({
  backgroundImage: destination.value
    ? `url(${destination.value.image})`
    : 'linear-gradient(180deg, #1F2933 0%, #2F6B4F 100%)',
}))

const categoryExperienceLabel = computed(() => {
  if (!destination.value) {
    return 'Eksplorasi khas Riau'
  }

  const categoryMap = {
    Alam: 'Eksplorasi alam',
    Budaya: 'Eksplorasi budaya',
    Bahari: 'Eksplorasi bahari',
    Kuliner: 'Eksplorasi kuliner',
    Sejarah: 'Eksplorasi sejarah',
  }

  return categoryMap[destination.value.category] || 'Eksplorasi khas Riau'
})

const experienceHighlights = computed(() => {
  if (!destination.value) {
    return []
  }

  return [
    {
      title: 'Cocok untuk fotografi',
      description: 'Sudut visual dramatis dengan cahaya alami yang kuat untuk dokumentasi perjalanan.',
      icon: Camera,
    },
    {
      title: 'Wisata keluarga',
      description: 'Nuansa perjalanan santai untuk itinerary singkat maupun liburan akhir pekan bersama.',
      icon: Users,
    },
    {
      title: categoryExperienceLabel.value,
      description: `Karakter ${destination.value.category.toLowerCase()} yang terasa kuat dan merepresentasikan pesona destinasi di Riau.`,
      icon: destination.value.category === 'Kuliner' ? Heart : Compass,
    },
  ]
})

const relatedDestinations = computed(() => {
  if (!destination.value) {
    return []
  }

  return destinations
    .filter((item) => item.category === destination.value.category && item.id !== destination.value.id)
    .slice(0, 3)
})

const reviewSummary = computed(() => {
  if (!destination.value) {
    return {
      average: '0.0',
      total: 0,
    }
  }

  const totalReviews = destinationReviews.value.length

  if (!totalReviews) {
    return {
      average: Number(destination.value.rating).toFixed(1),
      total: 0,
    }
  }

  const average = destinationReviews.value.reduce((sum, review) => sum + Number(review.rating), 0) / totalReviews

  return {
    average: average.toFixed(1),
    total: totalReviews,
  }
})

function getReviewInitial(name) {
  return (name || '?').trim().charAt(0).toUpperCase()
}

function shareDestination() {
  if (!destination.value) {
    return
  }

  const shareData = {
    title: destination.value.name,
    text: `Lihat destinasi ${destination.value.name} di Eksplorasi Wisata Riau.`,
    url: window.location.href,
  }

  if (navigator.share) {
    navigator.share(shareData).catch(() => {})
    return
  }

  navigator.clipboard?.writeText(window.location.href).catch(() => {})
}

function animatePage() {
  ctx?.revert()

  if (!detailRoot.value || !destination.value) {
    return
  }

  ctx = gsap.context(() => {
    gsap.from('[data-detail-hero-image]', {
      scale: 1.08,
      opacity: 0,
      duration: 1.15,
      ease: 'power3.out',
    })

    gsap.from('[data-detail-hero-copy]', {
      y: 32,
      opacity: 0,
      duration: 0.82,
      stagger: 0.08,
      ease: 'power3.out',
      delay: 0.12,
    })

    gsap.from('[data-detail-info]', {
      y: 34,
      opacity: 0,
      duration: 0.85,
      stagger: 0.08,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: detailRoot.value.querySelector('[data-detail-info-trigger]'),
        start: 'top 82%',
        once: true,
      },
    })

    gsap.from('[data-detail-review]', {
      y: 28,
      opacity: 0,
      duration: 0.8,
      stagger: 0.08,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: detailRoot.value.querySelector('[data-detail-review-trigger]'),
        start: 'top 84%',
        once: true,
      },
    })

    gsap.from('[data-detail-related-card]', {
      y: 24,
      opacity: 0,
      duration: 0.76,
      stagger: 0.08,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: detailRoot.value.querySelector('[data-detail-related-trigger]'),
        start: 'top 86%',
        once: true,
      },
    })
  }, detailRoot.value)
}

onMounted(async () => {
  await nextTick()
  animatePage()
})

watch(
  () => route.params.id,
  async () => {
    await nextTick()
    animatePage()
  },
)

onBeforeUnmount(() => {
  ctx?.revert()
})
</script>

<template>
  <section
    v-if="destination"
    ref="detailRoot"
    class="bg-[linear-gradient(180deg,#FDFCF8_0%,#F8F4EC_24%,#FDFCF8_100%)] pb-24"
  >
    <header class="relative isolate min-h-[46rem] overflow-hidden">
      <div
        data-detail-hero-image
        class="absolute inset-0 bg-cover bg-center"
        :style="heroImageStyle"
      ></div>
      <div class="absolute inset-0 bg-[linear-gradient(108deg,rgba(11,18,15,0.9)_0%,rgba(11,18,15,0.68)_36%,rgba(11,18,15,0.28)_64%,rgba(11,18,15,0.82)_100%)]"></div>
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(201,162,39,0.22),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(47,107,79,0.18),transparent_30%)]"></div>
      <div class="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#FDFCF8] to-transparent"></div>

      <div class="relative mx-auto flex min-h-[46rem] max-w-7xl items-end px-4 pb-14 pt-32 sm:px-6 lg:px-10 lg:pb-20">
        <div class="grid w-full gap-10 lg:grid-cols-[minmax(0,1fr)_21rem] lg:items-end">
          <div class="max-w-4xl">
            <div data-detail-hero-copy class="flex flex-wrap items-center gap-3">
              <RouterLink
                class="inline-flex items-center gap-2 rounded-full border border-white/18 bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur-xl transition duration-300 hover:bg-white hover:text-deep-charcoal"
                to="/explore"
              >
                <ArrowLeft class="size-4" />
                Kembali ke Explore
              </RouterLink>

              <span class="rounded-full border border-white/18 bg-white/10 px-4 py-2 text-sm font-semibold text-soft-gold backdrop-blur-xl">
                {{ destination.category }}
              </span>
              <span class="inline-flex items-center gap-2 rounded-full border border-white/18 bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur-xl">
                <Star class="size-4 fill-soft-gold text-soft-gold" />
                {{ destination.rating }} rating
              </span>
            </div>

            <p
              data-detail-hero-copy
              class="mt-8 text-sm font-semibold uppercase tracking-[0.26em] text-soft-gold"
            >
              Official Travel Guide Riau
            </p>

            <h1
              data-detail-hero-copy
              class="mt-4 font-serif text-5xl font-semibold leading-[0.98] text-white sm:text-6xl lg:text-8xl"
            >
              {{ destination.name }}
            </h1>

            <p
              data-detail-hero-copy
              class="mt-6 flex items-center gap-2 text-base font-semibold text-white/82 sm:text-lg"
            >
              <MapPin class="size-5 text-soft-gold" />
              {{ destination.location }}, Provinsi Riau
            </p>

            <p
              data-detail-hero-copy
              class="mt-6 max-w-2xl text-base leading-8 text-white/74 sm:text-lg"
            >
              {{ destination.description }}
            </p>

            <div
              data-detail-hero-copy
              class="mt-8 flex flex-wrap items-center gap-3"
            >
              <a
                v-if="hasCoordinates"
                class="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-deep-charcoal transition duration-300 hover:-translate-y-0.5 hover:bg-soft-gold"
                :href="mapLink"
                rel="noreferrer"
                target="_blank"
              >
                <Navigation class="size-4" />
                Lihat Lokasi
              </a>

              <button
                class="inline-flex items-center gap-2 rounded-full border border-white/18 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur-xl transition duration-300 hover:bg-white hover:text-deep-charcoal"
                type="button"
                @click="shareDestination"
              >
                <Share2 class="size-4" />
                Bagikan Destinasi
              </button>
            </div>
          </div>

          <div data-detail-hero-copy class="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            <div class="rounded-[1.75rem] border border-white/18 bg-white/10 p-5 text-white shadow-[0_18px_45px_rgba(0,0,0,0.14)] backdrop-blur-xl">
              <p class="text-xs font-semibold uppercase tracking-[0.22em] text-white/62">Kategori</p>
              <strong class="mt-3 block font-serif text-3xl font-semibold">{{ destination.category }}</strong>
            </div>
            <div class="rounded-[1.75rem] border border-white/18 bg-white/10 p-5 text-white shadow-[0_18px_45px_rgba(0,0,0,0.14)] backdrop-blur-xl">
              <p class="text-xs font-semibold uppercase tracking-[0.22em] text-white/62">Rating</p>
              <strong class="mt-3 block font-serif text-3xl font-semibold">{{ destination.rating }}</strong>
            </div>
            <div class="rounded-[1.75rem] border border-white/18 bg-white/10 p-5 text-white shadow-[0_18px_45px_rgba(0,0,0,0.14)] backdrop-blur-xl">
              <p class="text-xs font-semibold uppercase tracking-[0.22em] text-white/62">Review Aktif</p>
              <strong class="mt-3 block font-serif text-3xl font-semibold">{{ destinationReviews.length }}</strong>
            </div>
          </div>
        </div>
      </div>
    </header>

    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
      <section
        data-detail-info-trigger
        class="grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start"
      >
        <div data-detail-info class="rounded-[2rem] border border-white/80 bg-white/95 p-6 shadow-[0_28px_80px_rgba(31,41,51,0.08)] ring-1 ring-black/5 sm:p-8">
          <p class="text-sm font-semibold uppercase tracking-[0.24em] text-soft-gold">Tentang Destinasi</p>
          <h2 class="mt-4 font-serif text-4xl font-semibold leading-tight text-deep-charcoal">
            Pengalaman perjalanan yang merangkum karakter khas Riau.
          </h2>
          <p class="mt-5 text-base leading-8 text-muted-gray">
            {{ destination.description }}
          </p>
          <p class="mt-4 text-base leading-8 text-muted-gray">
            Destinasi ini menawarkan atmosfer yang kuat untuk wisatawan yang mencari pengalaman visual, cerita lokal, dan ritme perjalanan yang lebih berkesan dalam lanskap Provinsi Riau.
          </p>

          <div class="mt-8 grid gap-4 md:grid-cols-3">
            <article
              v-for="highlight in experienceHighlights"
              :key="highlight.title"
              data-detail-info
              class="rounded-[1.6rem] bg-soft-cream p-5 shadow-inner shadow-white"
            >
              <div class="grid size-12 place-items-center rounded-full bg-white text-nature-green shadow-sm">
                <component :is="highlight.icon" class="size-5" />
              </div>
              <h3 class="mt-4 text-lg font-semibold text-deep-charcoal">{{ highlight.title }}</h3>
              <p class="mt-2 text-sm leading-7 text-muted-gray">{{ highlight.description }}</p>
            </article>
          </div>
        </div>

        <aside
          data-detail-info
          class="lg:sticky lg:top-[8.5rem]"
        >
          <div class="rounded-[2rem] border border-white/80 bg-white/95 p-5 shadow-[0_28px_80px_rgba(31,41,51,0.08)] ring-1 ring-black/5 backdrop-blur sm:p-6">
            <div class="flex items-center justify-between gap-3">
              <div>
                <p class="text-xs font-semibold uppercase tracking-[0.24em] text-soft-gold">Info Perjalanan</p>
                <h3 class="mt-2 font-serif text-2xl font-semibold text-deep-charcoal">Ringkasan Destinasi</h3>
              </div>
              <div class="grid size-11 place-items-center rounded-full bg-soft-cream text-soft-gold">
                <Sparkles class="size-5" />
              </div>
            </div>

            <div class="mt-6 grid gap-3">
              <div class="rounded-[1.4rem] bg-soft-cream px-4 py-4">
                <p class="text-xs font-semibold uppercase tracking-[0.18em] text-muted-gray">Lokasi</p>
                <p class="mt-2 font-semibold text-deep-charcoal">{{ destination.location }}, Riau</p>
              </div>
              <div class="rounded-[1.4rem] bg-soft-cream px-4 py-4">
                <p class="text-xs font-semibold uppercase tracking-[0.18em] text-muted-gray">Kategori</p>
                <p class="mt-2 font-semibold text-deep-charcoal">{{ destination.category }}</p>
              </div>
              <div class="rounded-[1.4rem] bg-soft-cream px-4 py-4">
                <p class="text-xs font-semibold uppercase tracking-[0.18em] text-muted-gray">Rating</p>
                <p class="mt-2 font-semibold text-deep-charcoal">{{ destination.rating }} / 5</p>
              </div>
              <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                <div class="rounded-[1.4rem] bg-soft-cream px-4 py-4">
                  <p class="text-xs font-semibold uppercase tracking-[0.18em] text-muted-gray">Latitude</p>
                  <p class="mt-2 font-semibold text-deep-charcoal">
                    {{ hasCoordinates ? destination.latitude : 'Koordinat belum tersedia' }}
                  </p>
                </div>
                <div class="rounded-[1.4rem] bg-soft-cream px-4 py-4">
                  <p class="text-xs font-semibold uppercase tracking-[0.18em] text-muted-gray">Longitude</p>
                  <p class="mt-2 font-semibold text-deep-charcoal">
                    {{ hasCoordinates ? destination.longitude : 'Koordinat belum tersedia' }}
                  </p>
                </div>
              </div>
            </div>

            <div class="mt-6 grid gap-3">
              <a
                v-if="hasCoordinates"
                class="inline-flex items-center justify-center gap-2 rounded-full bg-deep-charcoal px-5 py-3 text-sm font-semibold text-white transition duration-300 hover:-translate-y-0.5 hover:bg-nature-green"
                :href="mapLink"
                rel="noreferrer"
                target="_blank"
              >
                <Navigation class="size-4" />
                Buka Peta
              </a>

              <button
                class="inline-flex items-center justify-center gap-2 rounded-full border border-black/8 bg-white px-5 py-3 text-sm font-semibold text-deep-charcoal transition duration-300 hover:-translate-y-0.5 hover:border-soft-gold/40 hover:bg-soft-cream"
                type="button"
                @click="shareDestination"
              >
                <Send class="size-4" />
                Bagikan Destinasi
              </button>
            </div>
          </div>
        </aside>
      </section>

      <DestinationGallery :destination="destination" />

      <section class="mt-16">
        <div class="overflow-hidden rounded-[2.25rem] bg-[linear-gradient(135deg,#1F2933_0%,#244333_52%,#2F6B4F_100%)] p-6 text-white shadow-[0_34px_90px_rgba(31,41,51,0.16)] sm:p-8 lg:p-10">
          <div class="grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-center">
            <div>
              <p class="text-sm font-semibold uppercase tracking-[0.24em] text-soft-gold">Peta Interaktif</p>
              <h2 class="mt-4 font-serif text-4xl font-semibold leading-tight">
                Rencanakan arah perjalananmu menuju {{ destination.name }}.
              </h2>
              <p class="mt-4 max-w-2xl leading-8 text-white/76">
                Gunakan koordinat destinasi ini untuk membuka Google Maps dan menyiapkan rute perjalanan yang lebih akurat saat menjelajahi Provinsi Riau.
              </p>
            </div>

            <div class="rounded-[1.9rem] border border-white/12 bg-white/8 p-5 backdrop-blur-xl">
              <div class="grid gap-3">
                <div class="rounded-[1.35rem] border border-white/10 bg-black/12 px-4 py-4">
                  <p class="text-xs font-semibold uppercase tracking-[0.18em] text-white/58">Latitude</p>
                  <p class="mt-2 font-semibold">
                    {{ hasCoordinates ? destination.latitude : 'Koordinat belum tersedia' }}
                  </p>
                </div>
                <div class="rounded-[1.35rem] border border-white/10 bg-black/12 px-4 py-4">
                  <p class="text-xs font-semibold uppercase tracking-[0.18em] text-white/58">Longitude</p>
                  <p class="mt-2 font-semibold">
                    {{ hasCoordinates ? destination.longitude : 'Koordinat belum tersedia' }}
                  </p>
                </div>
              </div>

              <a
                v-if="hasCoordinates"
                class="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-deep-charcoal transition duration-300 hover:-translate-y-0.5 hover:bg-soft-gold"
                :href="mapLink"
                rel="noreferrer"
                target="_blank"
              >
                <Navigation class="size-4" />
                Buka Google Maps
              </a>

              <p
                v-else
                class="mt-5 rounded-[1.35rem] border border-white/10 bg-black/12 px-4 py-3 text-sm text-white/72"
              >
                Koordinat belum tersedia untuk destinasi ini.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section
        data-detail-review-trigger
        class="mt-16 grid gap-8 lg:grid-cols-[0.94fr_1.06fr]"
      >
        <div
          data-detail-review
          class="rounded-[2rem] border border-white/80 bg-white/95 p-6 shadow-[0_28px_80px_rgba(31,41,51,0.08)] ring-1 ring-black/5 sm:p-8"
        >
          <p class="text-sm font-semibold uppercase tracking-[0.24em] text-soft-gold">Bagikan Pengalaman</p>
          <h2 class="mt-3 font-serif text-4xl font-semibold text-deep-charcoal">Tulis ulasan perjalananmu</h2>
          <p class="mt-3 max-w-xl leading-7 text-muted-gray">
            Ceritakan pengalaman, suasana, dan kesan yang kamu rasakan agar wisatawan lain bisa merencanakan kunjungan dengan lebih baik.
          </p>
          <ReviewForm class="mt-8" />
        </div>

        <div
          data-detail-review
          class="rounded-[2rem] border border-white/80 bg-white/95 p-6 shadow-[0_28px_80px_rgba(31,41,51,0.08)] ring-1 ring-black/5 sm:p-8"
        >
          <div class="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p class="text-sm font-semibold uppercase tracking-[0.24em] text-soft-gold">Ulasan Pengunjung</p>
              <h2 class="mt-3 font-serif text-4xl font-semibold text-deep-charcoal">Kesan dari para pelancong</h2>
            </div>

            <div class="rounded-[1.6rem] bg-soft-cream px-5 py-4 text-right">
              <p class="text-xs font-semibold uppercase tracking-[0.18em] text-muted-gray">Summary Rating</p>
              <strong class="mt-2 block font-serif text-4xl font-semibold text-deep-charcoal">{{ reviewSummary.average }}</strong>
              <p class="mt-1 text-sm text-muted-gray">{{ reviewSummary.total }} ulasan aktif</p>
            </div>
          </div>

          <div class="mt-8 space-y-4">
            <article
              v-for="review in destinationReviews"
              :key="review.id"
              data-detail-review
              class="rounded-[1.6rem] border border-black/6 bg-soft-cream/70 p-5"
            >
              <div class="flex items-start gap-4">
                <div class="grid size-12 shrink-0 place-items-center rounded-full bg-white font-semibold text-nature-green shadow-sm">
                  {{ getReviewInitial(review.name) }}
                </div>

                <div class="min-w-0 flex-1">
                  <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <strong class="block text-lg text-deep-charcoal">{{ review.name }}</strong>
                      <div class="mt-2 flex items-center gap-1">
                        <Star
                          v-for="score in 5"
                          :key="score"
                          class="size-4"
                          :class="score <= review.rating ? 'fill-soft-gold text-soft-gold' : 'text-black/10'"
                        />
                      </div>
                    </div>
                    <span class="text-sm font-semibold text-muted-gray">{{ review.rating }}/5</span>
                  </div>

                  <p class="mt-4 leading-7 text-muted-gray">{{ review.comment }}</p>
                </div>
              </div>
            </article>
          </div>

          <div
            v-if="destinationReviews.length === 0"
            class="mt-8 rounded-[1.6rem] border border-dashed border-black/10 bg-soft-cream/65 p-6 text-center"
          >
            <p class="font-semibold text-deep-charcoal">Belum ada ulasan untuk destinasi ini.</p>
            <p class="mt-2 text-sm leading-7 text-muted-gray">
              Jadilah yang pertama membagikan pengalaman perjalananmu di {{ destination.name }}.
            </p>
          </div>
        </div>
      </section>

      <section
        v-if="relatedDestinations.length > 0"
        data-detail-related-trigger
        class="mt-16"
      >
        <div class="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p class="text-sm font-semibold uppercase tracking-[0.24em] text-soft-gold">Destinasi Terkait</p>
            <h2 class="mt-3 font-serif text-4xl font-semibold text-deep-charcoal">Jelajahi pengalaman serupa di Riau</h2>
          </div>
          <p class="max-w-xl text-sm leading-7 text-muted-gray sm:text-right">
            Kurasi destinasi lain dengan nuansa perjalanan sejenis agar itinerary kamu terasa lebih utuh.
          </p>
        </div>

        <div class="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          <RouterLink
            v-for="item in relatedDestinations"
            :key="item.id"
            :to="`/destination/${item.id}`"
            data-detail-related-card
            class="group overflow-hidden rounded-[2rem] border border-white/75 bg-white/95 shadow-[0_22px_65px_rgba(31,41,51,0.08)] ring-1 ring-black/5 transition duration-500 hover:-translate-y-2 hover:shadow-[0_34px_95px_rgba(31,41,51,0.14)]"
          >
            <div class="relative m-2 overflow-hidden rounded-[1.6rem]">
              <img
                class="h-64 w-full object-cover transition duration-700 group-hover:scale-110"
                :src="item.image"
                :alt="item.name"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-deep-charcoal/70 via-transparent to-transparent"></div>
              <span class="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-nature-green">
                {{ item.category }}
              </span>
            </div>

            <div class="px-6 pb-6 pt-4">
              <h3 class="font-serif text-2xl font-semibold text-deep-charcoal">{{ item.name }}</h3>
              <p class="mt-3 flex items-center gap-2 text-sm font-medium text-muted-gray">
                <MapPin class="size-4 text-nature-green" />
                {{ item.location }}
              </p>
              <p class="mt-4 line-clamp-2 text-sm leading-7 text-muted-gray">{{ item.description }}</p>
              <span class="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-deep-charcoal">
                Lihat Detail
                <ArrowRight class="size-4 transition duration-300 group-hover:translate-x-1" />
              </span>
            </div>
          </RouterLink>
        </div>
      </section>
    </div>
  </section>

  <section
    v-else
    class="min-h-[70vh] bg-[linear-gradient(180deg,#FDFCF8_0%,#F8F4EC_100%)] px-4 py-28 sm:px-6 lg:px-10"
  >
    <div class="mx-auto max-w-3xl rounded-[2.25rem] border border-white/80 bg-white/95 p-8 text-center shadow-[0_28px_80px_rgba(31,41,51,0.08)] ring-1 ring-black/5 sm:p-12">
      <p class="text-sm font-semibold uppercase tracking-[0.24em] text-soft-gold">Destinasi Tidak Ditemukan</p>
      <h1 class="mt-4 font-serif text-4xl font-semibold text-deep-charcoal sm:text-5xl">
        Halaman destinasi ini belum tersedia.
      </h1>
      <p class="mt-4 leading-8 text-muted-gray">
        Destinasi yang kamu cari mungkin belum ada di direktori wisata Riau atau tautannya sudah berubah.
      </p>
      <RouterLink
        class="mt-8 inline-flex items-center gap-2 rounded-full bg-deep-charcoal px-6 py-3 font-semibold text-white transition duration-300 hover:-translate-y-0.5 hover:bg-nature-green"
        to="/explore"
      >
        <ArrowLeft class="size-4" />
        Kembali ke Explore
      </RouterLink>
    </div>
  </section>
</template>
