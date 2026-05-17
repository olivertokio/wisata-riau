<script setup>
import { Menu, X } from 'lucide-vue-next'
import gsap from 'gsap'
import { Observer } from 'gsap/Observer'
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

gsap.registerPlugin(Observer)

const route = useRoute()
const isOpen = ref(false)
const navRoot = ref(null)
let observer

const navItems = [
  { label: 'Home', to: '/' },
  { label: 'Explore', to: '/explore' },
  { label: 'Rencana Perjalanan', to: '/trip-planner' },
  { label: 'Profil', to: '/profile' },
]

function closeMenu() {
  isOpen.value = false
}

function toggleMenu() {
  isOpen.value = !isOpen.value
}

watch(
  () => route.fullPath,
  () => closeMenu(),
)

onMounted(() => {
  gsap.from(navRoot.value, {
    y: -18,
    opacity: 0,
    duration: 0.75,
    delay: 0.1,
    ease: 'power3.out',
  })

  observer = Observer.create({
    target: window,
    type: 'wheel,touch,scroll',
    tolerance: 12,
    onDown: closeMenu,
  })
})

onBeforeUnmount(() => {
  observer?.kill()
})
</script>

<template>
  <header
    ref="navRoot"
    class="fixed inset-x-0 top-0 z-50 border-b border-black/10 bg-[#F7F5F1]/88 backdrop-blur-md"
  >
    <div class="mx-auto flex h-[6.6rem] w-full max-w-[1600px] items-center justify-between gap-6 px-5 sm:px-8 lg:px-12">
      <RouterLink to="/" class="flex min-w-0 items-center rounded-full pr-2" aria-label="Eksplorasi Riau">
        <img
          src="/icons/logo-tanjak1.png"
          alt="Logo Tanjak"
          class="h-[4.4rem] w-auto max-w-[260px] object-contain mix-blend-multiply sm:h-[5.2rem] sm:max-w-[340px]"
          decoding="async"
        />
      </RouterLink>

      <nav
        class="hidden items-center gap-10 text-[1.1rem] font-medium text-deep-charcoal/88 lg:flex"
        aria-label="Navigasi utama"
      >
        <RouterLink
          v-for="item in navItems"
          :key="item.to"
          class="relative py-2 transition duration-300 hover:text-[#173626] [&.router-link-active]:text-[#173626]"
          :to="item.to"
        >
          {{ item.label }}
        </RouterLink>
      </nav>

      <div class="flex items-center gap-3">
        <RouterLink
          to="/explore"
          class="hidden rounded-[0.9rem] bg-[#31553D] px-7 py-4 text-lg font-semibold text-white shadow-[0_10px_24px_rgba(23,54,38,0.16)] transition duration-300 hover:bg-[#173626] lg:inline-flex"
        >
          Jelajahi Sekarang
        </RouterLink>

        <button
          class="inline-grid size-11 place-items-center rounded-full border border-black/10 bg-white/75 text-deep-charcoal transition hover:bg-[#173626] hover:text-white lg:hidden"
          type="button"
          :aria-expanded="isOpen"
          aria-controls="mobile-navigation"
          aria-label="Buka navigasi"
          @click="toggleMenu"
        >
          <X v-if="isOpen" class="size-5" />
          <Menu v-else class="size-5" />
        </button>
      </div>
    </div>

    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="-translate-y-3 opacity-0"
      enter-to-class="translate-y-0 opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="translate-y-0 opacity-100"
      leave-to-class="-translate-y-3 opacity-0"
    >
      <div
        v-if="isOpen"
        id="mobile-navigation"
        class="border-t border-black/8 bg-[#F7F5F1]/90 px-5 py-4 shadow-[0_20px_35px_rgba(31,41,51,0.05)] backdrop-blur-md lg:hidden sm:px-8"
      >
        <nav class="grid gap-1 text-base font-semibold text-deep-charcoal/82" aria-label="Navigasi mobile">
          <RouterLink
            v-for="item in navItems"
            :key="item.to"
            class="rounded-2xl px-4 py-3 transition hover:bg-white hover:text-[#173626] [&.router-link-active]:bg-[#173626] [&.router-link-active]:text-white"
            :to="item.to"
          >
            {{ item.label }}
          </RouterLink>
          <RouterLink
            class="mt-2 rounded-2xl bg-[#31553D] px-4 py-3 text-center text-white transition hover:bg-[#173626]"
            to="/explore"
          >
            Jelajahi Sekarang
          </RouterLink>
        </nav>
      </div>
    </Transition>
  </header>
</template>
