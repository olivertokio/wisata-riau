<script setup>
import { Bell, LogOut, Menu, Search } from 'lucide-vue-next'
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '../../stores/userStore'

defineEmits(['toggle-sidebar'])

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const title = computed(() => route.meta.title || 'Admin Dashboard')
const adminName = computed(() => userStore.user?.name || 'Admin')

async function handleLogout() {
  await userStore.logout()
  router.push('/')
}
</script>

<template>
  <header class="sticky top-0 z-30 border-b border-black/10 bg-white/95 backdrop-blur">
    <div class="flex h-20 items-center gap-4 px-4 sm:px-6">
      <button
        class="grid size-10 shrink-0 place-items-center rounded-lg border border-black/10 text-muted-gray lg:hidden"
        type="button"
        aria-label="Buka sidebar"
        @click="$emit('toggle-sidebar')"
      >
        <Menu class="size-5" />
      </button>

      <div class="min-w-0 flex-1">
        <p class="text-xs font-semibold uppercase tracking-[0.18em] text-soft-gold">Management Dashboard</p>
        <h1 class="mt-1 truncate text-xl font-bold text-deep-charcoal sm:text-2xl">{{ title }}</h1>
      </div>

      <label class="hidden h-11 w-72 items-center gap-3 rounded-lg border border-black/10 bg-soft-cream px-3 lg:flex">
        <Search class="size-4 shrink-0 text-muted-gray" />
        <input
          class="w-full bg-transparent text-sm text-deep-charcoal outline-none placeholder:text-muted-gray"
          type="search"
          placeholder="Cari data admin"
        />
      </label>

      <button
        class="grid size-11 place-items-center rounded-lg border border-black/10 text-muted-gray transition hover:border-soft-gold hover:text-nature-green"
        type="button"
        aria-label="Notifikasi"
      >
        <Bell class="size-5" />
      </button>

      <div class="hidden min-w-0 items-center gap-3 border-l border-black/10 pl-4 sm:flex">
        <div class="grid size-10 place-items-center rounded-lg bg-nature-green text-sm font-bold text-white">
          {{ adminName.slice(0, 1).toUpperCase() }}
        </div>
        <div class="min-w-0">
          <p class="truncate text-sm font-bold text-deep-charcoal">{{ adminName }}</p>
          <p class="text-xs font-medium text-muted-gray">Administrator</p>
        </div>
      </div>

      <button
        class="grid size-11 place-items-center rounded-lg border border-black/10 text-muted-gray transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
        type="button"
        aria-label="Logout admin"
        @click="handleLogout"
      >
        <LogOut class="size-5" />
      </button>
    </div>
  </header>
</template>
