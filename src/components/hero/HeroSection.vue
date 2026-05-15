<script setup>
import { ArrowRight, MapPin, Play, Star } from 'lucide-vue-next'
import gsap from 'gsap'
import { Observer } from 'gsap/Observer'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { destinations } from '../../data/dummyData'

gsap.registerPlugin(ScrollTrigger, Observer)

const heroRoot = ref(null)
const heroImage = ref(null)
const floatingLayer = ref(null)

const featuredDestination = computed(() => destinations[2])
const floatingDestinations = computed(() => [destinations[0], destinations[3]].filter(Boolean))

let observer
let context

onMounted(() => {
  context = gsap.context(() => {
    const timeline = gsap.timeline({
      defaults: {
        ease: 'power3.out',
      },
      scrollTrigger: {
        trigger: heroRoot.value,
        start: 'top 85%',
        once: true,
      },
    })

    timeline
      .from('.hero-copy-item', {
        y: 34,
        opacity: 0,
        duration: 0.85,
        stagger: 0.09,
      })
      .from(
        heroImage.value,
        {
          scale: 1.08,
          opacity: 0,
          duration: 1,
        },
        '-=0.55',
      )
      .from(
        '.hero-float-item',
        {
          y: 24,
          opacity: 0,
          duration: 0.8,
          stagger: 0.1,
        },
        '-=0.55',
      )

    gsap.to('.hero-drift', {
      y: -14,
      duration: 3.8,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      stagger: 0.35,
    })
  }, heroRoot.value)

  observer = Observer.create({
    target: heroRoot.value,
    type: 'pointer,touch',
    onMove(self) {
      if (!floatingLayer.value || typeof self.x !== 'number' || typeof self.y !== 'number') {
        return
      }

      const rect = heroRoot.value.getBoundingClientRect()
      const x = (self.x - rect.left - rect.width / 2) / rect.width
      const y = (self.y - rect.top - rect.height / 2) / rect.height

      gsap.to(floatingLayer.value, {
        x: x * 22,
        y: y * 18,
        rotate: x * 1.8,
        duration: 0.8,
        ease: 'power3.out',
      })
    },
  })
})

onBeforeUnmount(() => {
  observer?.kill()
  context?.revert()
})
</script>

<template>
  <section
    ref="heroRoot"
    class="relative isolate overflow-hidden bg-[linear-gradient(135deg,#FDFCF8_0%,#F7F3EA_48%,#FFFFFF_100%)] px-4 pb-16 pt-32 sm:px-6 lg:px-10 lg:pb-24 lg:pt-36"
  >
    <div class="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-soft-gold/40 to-transparent"></div>
    <div class="pointer-events-none absolute inset-x-6 top-28 h-28 rounded-[2rem] border border-white/50 bg-white/30 blur-2xl"></div>

    <div class="relative mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[0.92fr_1.08fr]">
      <div class="max-w-3xl">
        <p class="hero-copy-item inline-flex rounded-full border border-soft-gold/30 bg-white/75 px-4 py-2 text-sm font-semibold text-nature-green shadow-sm backdrop-blur-xl">
          Premium tourism guide of Riau
        </p>

        <h1 class="hero-copy-item mt-6 font-serif text-5xl font-semibold leading-[1.02] text-deep-charcoal sm:text-6xl lg:text-7xl">
          Jelajahi Riau dengan rasa sinematik dan tenang.
        </h1>

        <p class="hero-copy-item mt-6 max-w-2xl text-base leading-8 text-muted-gray sm:text-lg">
          Temukan wisata alam, budaya, sejarah, dan kuliner Riau dalam pengalaman visual yang premium, cepat, dan mudah dipakai di desktop maupun mobile.
        </p>

        <div class="hero-copy-item mt-8 flex flex-col gap-3 sm:flex-row">
          <RouterLink
            class="group inline-flex items-center justify-center gap-2 rounded-full bg-nature-green px-6 py-3.5 font-semibold text-white shadow-2xl shadow-green-900/15 transition duration-300 hover:-translate-y-0.5 hover:bg-deep-charcoal"
            to="/explore"
          >
            Jelajahi Destinasi
            <ArrowRight class="size-4 transition duration-300 group-hover:translate-x-1" />
          </RouterLink>

          <RouterLink
            class="inline-flex items-center justify-center gap-2 rounded-full border border-black/10 bg-white/80 px-6 py-3.5 font-semibold text-deep-charcoal shadow-sm backdrop-blur transition duration-300 hover:-translate-y-0.5 hover:border-soft-gold/50 hover:bg-white"
            to="/destination/3"
          >
            <Play class="size-4 fill-soft-gold text-soft-gold" />
            Lihat Highlight
          </RouterLink>
        </div>

        <div class="hero-copy-item mt-10 grid max-w-xl grid-cols-3 gap-3">
          <div class="rounded-3xl border border-white/70 bg-white/70 p-4 shadow-sm backdrop-blur">
            <strong class="block text-2xl text-nature-green">50+</strong>
            <span class="text-sm text-muted-gray">Destinasi</span>
          </div>
          <div class="rounded-3xl border border-white/70 bg-white/70 p-4 shadow-sm backdrop-blur">
            <strong class="block text-2xl text-nature-green">5</strong>
            <span class="text-sm text-muted-gray">Kategori</span>
          </div>
          <div class="rounded-3xl border border-white/70 bg-white/70 p-4 shadow-sm backdrop-blur">
            <strong class="block text-2xl text-nature-green">4.8</strong>
            <span class="text-sm text-muted-gray">Rating</span>
          </div>
        </div>
      </div>

      <div class="relative min-h-[34rem]">
        <div ref="floatingLayer" class="pointer-events-none absolute inset-0 z-30">
          <div class="hero-float-item hero-drift absolute -left-1 top-16 z-40 hidden w-48 overflow-hidden rounded-[1.5rem] border border-white/70 bg-white/80 p-2 shadow-2xl shadow-green-950/15 backdrop-blur-xl sm:block lg:-left-8">
            <img class="h-28 w-full rounded-[1.1rem] object-cover" :src="floatingDestinations[0]?.image" :alt="floatingDestinations[0]?.name" />
            <div class="px-2 py-3">
              <p class="text-xs font-semibold text-soft-gold">{{ floatingDestinations[0]?.category }}</p>
              <p class="mt-1 font-semibold">{{ floatingDestinations[0]?.name }}</p>
            </div>
          </div>

          <div class="hero-float-item hero-drift absolute -right-1 bottom-12 z-40 w-52 overflow-hidden rounded-[1.5rem] border border-white/70 bg-white/85 p-2 shadow-2xl shadow-green-950/15 backdrop-blur-xl sm:w-60 lg:-right-5">
            <img class="h-32 w-full rounded-[1.1rem] object-cover" :src="floatingDestinations[1]?.image" :alt="floatingDestinations[1]?.name" />
            <div class="px-2 py-3">
              <p class="text-xs font-semibold text-soft-gold">{{ floatingDestinations[1]?.category }}</p>
              <p class="mt-1 font-semibold">{{ floatingDestinations[1]?.name }}</p>
            </div>
          </div>

          <div class="hero-float-item absolute right-6 top-8 z-40 rounded-full border border-white/70 bg-white/85 px-4 py-3 shadow-xl shadow-green-950/10 backdrop-blur-xl">
            <div class="flex items-center gap-2">
              <span class="grid size-9 place-items-center rounded-full bg-soft-gold text-white">
                <Star class="size-4 fill-white" />
              </span>
              <div>
                <p class="text-sm font-semibold">{{ featuredDestination.rating }} rating</p>
                <p class="text-xs text-muted-gray">{{ featuredDestination.reviewCount }} ulasan</p>
              </div>
            </div>
          </div>

          <div class="hero-float-item absolute left-4 bottom-24 z-40 rounded-full border border-white/70 bg-white/85 px-4 py-3 shadow-xl shadow-green-950/10 backdrop-blur-xl sm:left-12">
            <div class="flex items-center gap-2">
              <span class="grid size-9 place-items-center rounded-full bg-nature-green text-white">
                <MapPin class="size-4" />
              </span>
              <div>
                <p class="text-sm font-semibold">{{ featuredDestination.location }}</p>
                <p class="text-xs text-muted-gray">Riau, Indonesia</p>
              </div>
            </div>
          </div>
        </div>

        <div class="relative z-10 overflow-hidden rounded-[2.25rem] bg-white p-3 shadow-[0_40px_120px_rgba(47,107,79,0.18)] ring-1 ring-black/5">
          <img
            ref="heroImage"
            class="h-[34rem] w-full rounded-[1.75rem] object-cover"
            :src="featuredDestination.image"
            :alt="featuredDestination.name"
          />
        </div>
      </div>
    </div>
  </section>
</template>
