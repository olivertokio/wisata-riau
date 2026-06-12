<script setup>
import {
  BarChart3,
  FolderTree,
  GalleryHorizontalEnd,
  Home,
  Images,
  MapPinned,
  MessageCircle,
  Settings,
  Star,
  Users,
  X,
} from 'lucide-vue-next'
import { onBeforeUnmount, onMounted, ref } from 'vue'
import {
  getAdminConversations,
  subscribeToCustomerMessages,
  unsubscribeChannel,
} from '../../services/customerServiceChatService'
import { hasSupabaseConfig } from '../../services/supabase'

defineProps({
  open: {
    type: Boolean,
    default: false,
  },
})

defineEmits(['close'])

const unreadCount = ref(0)
let sidebarChannel = null

const navigation = [
  { label: 'Dashboard', to: '/admin', icon: BarChart3 },
  { label: 'Destinations', to: '/admin/destinations', icon: MapPinned },
  { label: 'Categories', to: '/admin/categories', icon: FolderTree },
  { label: 'Reviews', to: '/admin/reviews', icon: Star },
  { label: 'Users', to: '/admin/users', icon: Users },
  { label: 'Trip Plans', to: '/admin/trip-plans', icon: Home },
  { label: 'Gallery', to: '/admin/gallery', icon: Images },
  { label: 'Customer Service', to: '/admin/customer-service', icon: MessageCircle },
  { label: 'Settings', to: '/admin/settings', icon: Settings },
]

async function loadUnreadCount() {
  try {
    const conversations = await getAdminConversations()
    unreadCount.value = conversations.reduce((total, conversation) => (
      total + Number(conversation.unread_count || 0)
    ), 0)
  } catch {
    unreadCount.value = 0
  }
}

onMounted(() => {
  if (!hasSupabaseConfig) return

  loadUnreadCount()
  sidebarChannel = subscribeToCustomerMessages({
    onInsert(message) {
      if (message.sender_type === 'user') {
        unreadCount.value += 1
      }
    },
  })
})

onBeforeUnmount(() => {
  unsubscribeChannel(sidebarChannel)
})
</script>

<template>
  <aside
    class="fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-black/10 bg-white transition-transform duration-300 lg:sticky lg:top-0 lg:z-auto lg:h-screen lg:translate-x-0"
    :class="open ? 'translate-x-0' : '-translate-x-full'"
  >
    <div class="flex h-20 items-center justify-between border-b border-black/10 px-5">
      <RouterLink class="flex items-center gap-3" to="/admin" @click="$emit('close')">
        <img class="size-11 rounded-lg object-contain" src="/icons/logo-riauscape.png" alt="RiauScape" />
        <span>
          <span class="block text-base font-bold text-deep-charcoal">RiauScape</span>
          <span class="block text-xs font-semibold uppercase tracking-[0.18em] text-soft-gold">Admin CMS</span>
        </span>
      </RouterLink>

      <button
        class="grid size-10 place-items-center rounded-lg border border-black/10 text-muted-gray lg:hidden"
        type="button"
        aria-label="Tutup sidebar"
        @click="$emit('close')"
      >
        <X class="size-5" />
      </button>
    </div>

    <nav class="flex-1 space-y-1 overflow-y-auto px-3 py-5">
      <RouterLink
        v-for="item in navigation"
        :key="item.to"
        :to="item.to"
        class="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-semibold text-muted-gray transition hover:bg-soft-cream hover:text-nature-green"
        exact-active-class="bg-nature-green text-white hover:bg-nature-green hover:text-white"
        @click="$emit('close')"
      >
        <component :is="item.icon" class="size-5" />
        <span>{{ item.label }}</span>
        <span
          v-if="item.to === '/admin/customer-service' && unreadCount > 0"
          class="ml-auto rounded-full bg-red-600 px-2 py-0.5 text-[0.68rem] font-bold text-white"
        >
          {{ unreadCount }}
        </span>
      </RouterLink>
    </nav>

    <div class="border-t border-black/10 p-4">
      <RouterLink
        class="flex items-center gap-3 rounded-lg bg-soft-cream px-3 py-3 text-sm font-semibold text-nature-green transition hover:bg-nature-green hover:text-white"
        to="/"
      >
        <GalleryHorizontalEnd class="size-5" />
        <span>Lihat Website</span>
      </RouterLink>
    </div>
  </aside>
</template>
