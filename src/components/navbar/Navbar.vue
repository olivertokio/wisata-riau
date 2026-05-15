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
  { label: 'Tambah', to: '/add-destination' },
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
    y: -28,
    opacity: 0,
    duration: 0.9,
    delay: 0.15,
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
    class="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-5"
  >
    <div
      class="mx-auto flex max-w-7xl items-center justify-between gap-3 rounded-full border border-white/45 bg-white/40 px-3 py-2 shadow-[0_18px_50px_rgba(31,41,51,0.06)] ring-1 ring-black/5 backdrop-blur-xl sm:px-4"
    >
      <RouterLink to="/" class="group flex min-w-0 items-center gap-3 rounded-full pr-2" aria-label="Eksplorasi Wisata Riau">
        <div
          class="grid size-11 shrink-0 place-items-center rounded-full bg-deep-charcoal text-sm font-semibold text-white shadow-xl shadow-green-950/15 transition duration-300 group-hover:scale-105 group-hover:bg-nature-green"
        >
          EWR
        </div>

        <div class="hidden leading-tight sm:block">
          <p class="text-[0.68rem] font-semibold uppercase text-soft-gold">
            Premium Travel
          </p>
          <p class="font-serif text-lg font-semibold text-deep-charcoal">
            Eksplorasi Riau
          </p>
        </div>
      </RouterLink>

      <nav
        class="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 rounded-full border border-white/30 bg-white/25 p-1 text-sm font-medium text-muted-gray shadow-inner shadow-white/30 backdrop-blur-xl lg:flex"
        aria-label="Navigasi utama"
      >
        <RouterLink
          v-for="item in navItems"
          :key="item.to"
          class="rounded-full px-4 py-2.5 transition duration-300 hover:bg-white hover:text-deep-charcoal hover:shadow-sm [&.router-link-active]:bg-deep-charcoal [&.router-link-active]:text-white [&.router-link-active]:shadow-lg [&.router-link-active]:shadow-green-950/10"
          :to="item.to"
        >
          {{ item.label }}
        </RouterLink>
      </nav>

      <div class="flex items-center gap-2">
        <RouterLink
          to="/explore"
          class="hidden rounded-full bg-nature-green/90 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-green-900/10 transition duration-300 hover:-translate-y-0.5 hover:bg-deep-charcoal md:inline-flex"
        >
          Jelajahi Sekarang
        </RouterLink>

        <button
          class="inline-grid size-11 place-items-center rounded-full bg-white/45 text-deep-charcoal backdrop-blur-xl transition hover:bg-deep-charcoal hover:text-white lg:hidden"
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
        class="mx-auto mt-3 max-w-7xl rounded-[1.75rem] border border-white/45 bg-white/55 p-3 shadow-xl shadow-green-950/8 ring-1 ring-black/5 backdrop-blur-xl lg:hidden"
      >
        <nav class="grid gap-1 text-sm font-semibold text-muted-gray" aria-label="Navigasi mobile">
          <RouterLink
            v-for="item in navItems"
            :key="item.to"
            class="rounded-2xl px-4 py-3 transition hover:bg-soft-cream hover:text-deep-charcoal [&.router-link-active]:bg-nature-green [&.router-link-active]:text-white"
            :to="item.to"
          >
            {{ item.label }}
          </RouterLink>
          <RouterLink
            class="mt-2 rounded-2xl bg-deep-charcoal px-4 py-3 text-center text-white transition hover:bg-nature-green"
            to="/login"
          >
            Login
          </RouterLink>
        </nav>
      </div>
    </Transition>
  </header>
</template>
