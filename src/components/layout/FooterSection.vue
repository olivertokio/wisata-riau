<script setup>
import { ArrowRight, Instagram, Mail, MapPin } from 'lucide-vue-next'
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { categories } from '../../data/categories'
import { createScrollReveal } from '../../gsap/scrollReveal'

const footerRoot = ref(null)
let revealContext

const quickLinks = [
  { label: 'Home', to: '/' },
  { label: 'Explore', to: '/explore' },
  { label: 'Rencana Perjalanan', to: '/trip-planner' },
  { label: 'Profil', to: '/profile' },
]

onMounted(() => {
  revealContext = createScrollReveal(footerRoot.value, {
    targets: '.footer-reveal',
    start: 'top 82%',
    y: 28,
    stagger: 0.07,
  })
})

onBeforeUnmount(() => {
  revealContext?.revert()
})
</script>

<template>
  <footer ref="footerRoot" class="bg-deep-charcoal px-4 pt-16 text-white sm:px-6 lg:px-10">
    <div class="mx-auto max-w-7xl">
      <div class="footer-reveal rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 sm:p-8">
        <div class="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p class="text-sm font-semibold uppercase text-soft-gold">Eksplorasi Riau</p>
            <h2 class="mt-3 font-serif text-3xl font-semibold text-white sm:text-4xl">
              Mulai jelajahi Riau
            </h2>
            <p class="mt-3 max-w-2xl leading-7 text-white/65">
              Temukan inspirasi perjalanan yang dekat, kaya budaya, dan terasa sinematik dari jantung Sumatra.
            </p>
          </div>

          <RouterLink
            class="group inline-flex w-fit items-center justify-center gap-2 rounded-full bg-soft-gold px-6 py-3.5 font-semibold text-deep-charcoal shadow-2xl shadow-black/20 transition duration-300 hover:-translate-y-0.5 hover:bg-white"
            to="/explore"
          >
            Mulai jelajahi Riau
            <ArrowRight class="size-4 transition duration-300 group-hover:translate-x-1" />
          </RouterLink>
        </div>
      </div>

      <div class="grid gap-10 border-b border-white/10 py-12 md:grid-cols-2 lg:grid-cols-[1.25fr_0.72fr_0.72fr_1fr]">
        <div class="footer-reveal">
          <RouterLink to="/" class="inline-flex items-center gap-3" aria-label="Eksplorasi Riau">
            <span class="grid size-12 place-items-center rounded-full bg-white text-sm font-bold text-deep-charcoal">
              EWR
            </span>
            <span>
              <span class="block text-xs font-semibold uppercase text-soft-gold">Premium Travel</span>
              <span class="block font-serif text-xl font-semibold text-white">Eksplorasi Riau</span>
            </span>
          </RouterLink>
          <p class="mt-5 max-w-sm leading-7 text-white/62">
            Panduan visual untuk wisata alam, budaya, bahari, kuliner, dan sejarah di Provinsi Riau.
          </p>
        </div>

        <nav class="footer-reveal" aria-label="Quick links">
          <h3 class="font-semibold text-white">Quick links</h3>
          <div class="mt-5 grid gap-3 text-sm text-white/62">
            <RouterLink v-for="link in quickLinks" :key="link.to" class="transition hover:text-soft-gold" :to="link.to">
              {{ link.label }}
            </RouterLink>
          </div>
        </nav>

        <nav class="footer-reveal" aria-label="Kategori wisata">
          <h3 class="font-semibold text-white">Kategori</h3>
          <div class="mt-5 grid gap-3 text-sm text-white/62">
            <RouterLink
              v-for="category in categories"
              :key="category.id"
              class="transition hover:text-soft-gold"
              :to="`/explore?category=${category.name}`"
            >
              {{ category.name }}
            </RouterLink>
          </div>
        </nav>

        <div class="footer-reveal">
          <h3 class="font-semibold text-white">Kontak</h3>
          <div class="mt-5 grid gap-4 text-sm text-white/62">
            <p class="flex items-center gap-3">
              <MapPin class="size-4 text-soft-gold" />
              Riau, Indonesia
            </p>
            <a class="flex min-w-0 items-center gap-3 break-words transition hover:text-soft-gold" href="mailto:hello@eksplorasiriau.id">
              <Mail class="size-4 text-soft-gold" />
              <span>hello@eksplorasiriau.id</span>
            </a>
            <a class="flex items-center gap-3 transition hover:text-soft-gold" href="https://www.instagram.com/eksplorasiriau" target="_blank" rel="noreferrer">
              <Instagram class="size-4 text-soft-gold" />
              @eksplorasiriau
            </a>
          </div>
        </div>
      </div>

      <div class="footer-reveal flex flex-col gap-3 py-6 text-sm text-white/45 sm:flex-row sm:items-center sm:justify-between">
        <p>&copy; 2026 Eksplorasi Riau. All rights reserved.</p>
        <p>Provinsi Riau, Indonesia</p>
      </div>
    </div>
  </footer>
</template>
