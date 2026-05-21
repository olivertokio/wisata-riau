<script setup>
import { ArrowLeft, ArrowRight, MapPin, Play, Star, Volume2, VolumeX } from 'lucide-vue-next'
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { popularDestinations } from '../../data/destinations'

gsap.registerPlugin(ScrollTrigger)

const sliderRoot = ref(null)
const videoRef = ref(null)
const progressBar = ref(null)
const activeIndex = ref(0)
const isAnimating = ref(false)
const videoFailed = ref(false)
const isMuted = ref(true)

const slideDuration = 15000
const defaultVolume = 0.3
let autoPlayTimer = null
let ctx = null
let progressTween = null
let isSectionVisible = false

const activeDestination = computed(() => popularDestinations[activeIndex.value])

function destinationPath(destination) {
  return destination.detailPath || `/explore?category=${destination.category}`
}

function shouldReduceMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function normalizeIndex(index) {
  return (index + popularDestinations.length) % popularDestinations.length
}

function animateProgress() {
  progressTween?.kill()

  if (!progressBar.value) {
    return
  }

  gsap.set(progressBar.value, { scaleX: 0 })

  if (shouldReduceMotion() || !isSectionVisible) {
    return
  }

  progressTween = gsap.to(progressBar.value, {
    scaleX: 1,
    duration: slideDuration / 1000,
    ease: 'none',
  })
}

function startAutoPlay() {
  isSectionVisible = true
  stopAutoPlay()
  animateProgress()

  autoPlayTimer = window.setInterval(() => {
    nextSlide()
  }, slideDuration)
}

function stopAutoPlay() {
  if (autoPlayTimer) {
    window.clearInterval(autoPlayTimer)
    autoPlayTimer = null
  }

  progressTween?.kill()
}

function restartAutoPlayIfVisible() {
  if (isSectionVisible) {
    startAutoPlay()
  }
}

async function goToSlide(index) {
  const targetIndex = normalizeIndex(index)

  if (isAnimating.value || targetIndex === activeIndex.value) {
    return
  }

  isAnimating.value = true
  stopAutoPlay()

  if (!shouldReduceMotion()) {
    await gsap.to(sliderRoot.value?.querySelectorAll('.destination-copy > *'), {
      y: -18,
      opacity: 0,
      duration: 0.28,
      stagger: 0.025,
      ease: 'power2.in',
    })

    await gsap.to(sliderRoot.value?.querySelector('.destination-media-active'), {
      scale: 1.04,
      opacity: 0.72,
      duration: 0.34,
      ease: 'power2.inOut',
    })
  }

  videoFailed.value = false
  activeIndex.value = targetIndex
}

function nextSlide() {
  goToSlide(activeIndex.value + 1)
}

function prevSlide() {
  goToSlide(activeIndex.value - 1)
}

function handleVideoError() {
  videoFailed.value = true
}

function handleImageError(event, destination) {
  if (event.currentTarget.src !== destination.fallbackImage) {
    event.currentTarget.src = destination.fallbackImage
  }
}

function syncVideoAudio() {
  if (!videoRef.value) {
    return
  }

  videoRef.value.volume = defaultVolume
  videoRef.value.muted = isMuted.value
}

function toggleSound() {
  if (!videoRef.value) {
    return
  }

  isMuted.value = !isMuted.value
  syncVideoAudio()
  videoRef.value.play?.().catch(() => {})
}

watch(activeIndex, async () => {
  await nextTick()

  if (videoRef.value) {
    syncVideoAudio()
    videoRef.value.load()
    syncVideoAudio()
    videoRef.value.play?.().catch(() => {})
  }

  if (!shouldReduceMotion()) {
    gsap.fromTo(
      sliderRoot.value?.querySelector('.destination-media-active'),
      { scale: 1.08, opacity: 0.7 },
      { scale: 1, opacity: 1, duration: 0.78, ease: 'power3.out' },
    )

    await gsap.fromTo(
      sliderRoot.value?.querySelectorAll('.destination-copy > *'),
      { y: 26, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.62, stagger: 0.055, ease: 'power3.out' },
    )
  }

  isAnimating.value = false
  restartAutoPlayIfVisible()
})

onMounted(() => {
  syncVideoAudio()

  ctx = gsap.context(() => {
    gsap.from('.destination-shell', {
      y: 80,
      opacity: 0,
      scale: 0.97,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: sliderRoot.value,
        start: 'top 85%',
        once: true,
      },
    })

    ScrollTrigger.create({
      trigger: sliderRoot.value,
      start: 'top 75%',
      end: 'bottom 20%',
      onEnter: startAutoPlay,
      onEnterBack: startAutoPlay,
      onLeave: () => {
        isSectionVisible = false
        stopAutoPlay()
      },
      onLeaveBack: () => {
        isSectionVisible = false
        stopAutoPlay()
      },
    })
  }, sliderRoot.value)
})

onBeforeUnmount(() => {
  isSectionVisible = false
  stopAutoPlay()
  ctx?.revert()
})
</script>

<template>
  <section
    ref="sliderRoot"
    class="relative isolate overflow-hidden bg-premium-white py-14 sm:py-16 lg:py-24"
    aria-labelledby="popular-slider-title"
  >
    <div class="destination-shell relative mx-auto h-[36rem] max-w-[94rem] overflow-hidden bg-deep-charcoal shadow-[0_42px_120px_rgba(31,41,51,0.24)] ring-1 ring-black/5 sm:h-[42rem] sm:rounded-[2.5rem] lg:h-[50rem]">
      <video
        v-if="!videoFailed"
        ref="videoRef"
        class="destination-media-active absolute inset-0 h-full w-full object-cover"
        autoplay
        muted
        loop
        playsinline
        preload="metadata"
        :poster="activeDestination.thumbnail"
        :muted="isMuted"
        @error="handleVideoError"
      >
        <source :src="activeDestination.video" type="video/mp4" @error="handleVideoError" />
      </video>

      <img
        v-else
        :key="activeDestination.fallbackImage"
        class="destination-media-active absolute inset-0 h-full w-full object-cover"
        :src="activeDestination.thumbnail"
        :alt="activeDestination.title"
        @error="handleImageError($event, activeDestination)"
      />

      <div class="destination-overlay absolute inset-0 bg-[linear-gradient(90deg,rgba(10,18,15,0.92)_0%,rgba(10,18,15,0.64)_42%,rgba(10,18,15,0.24)_72%,rgba(10,18,15,0.72)_100%)]"></div>
      <div class="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/75 to-transparent"></div>

      <div class="relative z-10 flex h-full flex-col justify-between px-4 py-5 sm:px-8 sm:py-8 lg:px-12 lg:py-10">
        <div class="flex items-center justify-between gap-4">
          <div class="destination-copy">
            <p class="inline-flex items-center gap-2 rounded-full border border-white/18 bg-white/12 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-soft-gold backdrop-blur-xl">
              <Play class="size-3 fill-soft-gold" />
              Pilihan wisatawan minggu ini
            </p>
          </div>

          <div class="hidden items-center gap-2 sm:flex">
            <button
              class="grid size-12 place-items-center rounded-full border border-white/20 bg-white/12 text-white backdrop-blur-xl transition duration-300 hover:bg-white hover:text-deep-charcoal"
              type="button"
              aria-label="Destinasi sebelumnya"
              @click="prevSlide"
            >
              <ArrowLeft class="size-5" />
            </button>
            <button
              class="grid size-12 place-items-center rounded-full border border-white/20 bg-white/12 text-white backdrop-blur-xl transition duration-300 hover:bg-white hover:text-deep-charcoal"
              type="button"
              aria-label="Destinasi berikutnya"
              @click="nextSlide"
            >
              <ArrowRight class="size-5" />
            </button>
          </div>
        </div>

        <div class="destination-copy max-w-4xl">
            <p class="mb-4 inline-flex items-center gap-2 rounded-full bg-soft-gold px-4 py-2 text-sm font-semibold text-deep-charcoal sm:mb-5">
              {{ activeDestination.category }}
            </p>
            <h2 id="popular-slider-title" class="planner-display text-4xl font-semibold leading-[0.98] text-white sm:text-6xl lg:text-8xl">
              {{ activeDestination.title }}
            </h2>
            <p class="mt-5 flex items-center gap-2 text-sm font-semibold text-white/78 sm:mt-6 sm:text-base">
              <MapPin class="size-5 text-soft-gold" />
              {{ activeDestination.location }}
            </p>
            <p class="mt-4 max-w-2xl text-sm leading-7 text-white/72 sm:mt-5 sm:text-lg sm:leading-8">
              {{ activeDestination.description }}
            </p>
            <div class="mt-6 flex flex-wrap items-center gap-3 sm:mt-7">
              <RouterLink
                class="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-deep-charcoal transition duration-300 hover:-translate-y-0.5 hover:bg-soft-gold"
                :to="destinationPath(activeDestination)"
              >
                Lihat detail
                <ArrowRight class="size-4" />
              </RouterLink>
              <span class="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/12 px-4 py-3 text-sm font-semibold text-white backdrop-blur-xl">
                <Star class="size-4 fill-soft-gold text-soft-gold" />
                {{ activeDestination.rating }} &middot; {{ activeDestination.reviewCount }} ulasan
              </span>
            </div>
        </div>

        <div class="absolute inset-x-4 bottom-3 z-20 sm:inset-x-8 sm:bottom-4 lg:inset-x-12">
          <div class="h-px overflow-hidden rounded-full bg-white/24">
            <div ref="progressBar" class="h-full origin-left scale-x-0 bg-soft-gold"></div>
          </div>
        </div>

        <button
          v-if="!videoFailed"
          class="absolute bottom-16 right-4 z-20 inline-flex items-center gap-2 rounded-full border border-white/18 bg-white/12 px-4 py-3 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(0,0,0,0.18)] backdrop-blur-xl transition duration-300 hover:-translate-y-0.5 hover:bg-white hover:text-deep-charcoal sm:bottom-8 sm:right-8 lg:bottom-10 lg:right-12"
          type="button"
          :aria-label="isMuted ? 'Aktifkan suara video' : 'Matikan suara video'"
          @click="toggleSound"
        >
          <Transition
            enter-active-class="transition duration-200 ease-out"
            enter-from-class="scale-75 opacity-0"
            enter-to-class="scale-100 opacity-100"
            leave-active-class="transition duration-150 ease-in"
            leave-from-class="scale-100 opacity-100"
            leave-to-class="scale-75 opacity-0"
            mode="out-in"
          >
            <VolumeX v-if="isMuted" key="muted" class="size-4.5" />
            <Volume2 v-else key="unmuted" class="size-4.5" />
          </Transition>
          <span class="hidden sm:inline">{{ isMuted ? 'Muted' : 'Audio On' }}</span>
        </button>

        <div class="absolute right-4 top-16 z-20 flex items-center gap-2 sm:hidden">
          <button
            class="grid size-11 place-items-center rounded-full border border-white/20 bg-white/12 text-white backdrop-blur-xl"
            type="button"
            aria-label="Destinasi sebelumnya"
            @click="prevSlide"
          >
            <ArrowLeft class="size-5" />
          </button>
          <button
            class="grid size-11 place-items-center rounded-full border border-white/20 bg-white/12 text-white backdrop-blur-xl"
            type="button"
            aria-label="Destinasi berikutnya"
            @click="nextSlide"
          >
            <ArrowRight class="size-5" />
          </button>
        </div>
      </div>
    </div>
  </section>
</template>
