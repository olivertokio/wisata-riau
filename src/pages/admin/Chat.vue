<script setup>
import { MessageCircle, Send, Wifi, WifiOff } from 'lucide-vue-next'
import { computed, ref } from 'vue'

const isOnline = ref(true)
const activeThreadId = ref(1)
const reply = ref('')

const threads = ref([
  {
    id: 1,
    name: 'Nadia Putri',
    subject: 'Rekomendasi itinerary Siak',
    status: 'open',
    messages: [
      { from: 'user', text: 'Halo, saya ingin itinerary 3 hari untuk Siak dan sekitar.' },
      { from: 'admin', text: 'Baik, kami bisa bantu susun rute budaya dan kuliner.' },
    ],
  },
  {
    id: 2,
    name: 'Rafi Hidayat',
    subject: 'Info Pantai Rupat',
    status: 'waiting',
    messages: [
      { from: 'user', text: 'Apakah ada rekomendasi waktu terbaik ke Pantai Rupat?' },
    ],
  },
  {
    id: 3,
    name: 'Melati Sari',
    subject: 'Update foto destinasi',
    status: 'closed',
    messages: [
      { from: 'user', text: 'Foto Tangsi Belanda bisa diperbarui?' },
      { from: 'admin', text: 'Terima kasih, tim konten akan meninjau galeri.' },
    ],
  },
])

const activeThread = computed(() => threads.value.find((thread) => thread.id === activeThreadId.value))

function sendReply() {
  if (!reply.value.trim()) return

  activeThread.value.messages.push({
    from: 'admin',
    text: reply.value.trim(),
  })
  activeThread.value.status = 'open'
  reply.value = ''
}
</script>

<template>
  <div class="space-y-5">
    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 class="text-xl font-bold text-deep-charcoal">Customer Service Chat</h2>
        <p class="mt-1 text-sm font-medium text-muted-gray">Dummy inbox untuk tahap awal layanan pengunjung.</p>
      </div>
      <button
        class="inline-flex items-center justify-center gap-2 rounded-lg border border-black/10 bg-white px-4 py-2.5 text-sm font-bold text-deep-charcoal transition hover:border-soft-gold"
        type="button"
        @click="isOnline = !isOnline"
      >
        <component :is="isOnline ? Wifi : WifiOff" class="size-4" />
        {{ isOnline ? 'Online' : 'Offline' }}
      </button>
    </div>

    <div class="grid min-h-[34rem] gap-5 lg:grid-cols-[22rem_1fr]">
      <aside class="overflow-hidden rounded-lg border border-black/10 bg-white">
        <div class="border-b border-black/10 px-4 py-3">
          <h3 class="text-sm font-bold uppercase tracking-[0.14em] text-muted-gray">Inbox</h3>
        </div>
        <button
          v-for="thread in threads"
          :key="thread.id"
          class="block w-full border-b border-black/10 px-4 py-4 text-left transition hover:bg-soft-cream"
          :class="thread.id === activeThreadId ? 'bg-soft-cream' : 'bg-white'"
          type="button"
          @click="activeThreadId = thread.id"
        >
          <div class="flex items-start justify-between gap-3">
            <div class="min-w-0">
              <p class="truncate text-sm font-bold text-deep-charcoal">{{ thread.name }}</p>
              <p class="mt-1 truncate text-xs font-semibold text-muted-gray">{{ thread.subject }}</p>
            </div>
            <span class="rounded-lg bg-white px-2 py-1 text-[0.68rem] font-bold uppercase text-nature-green">{{ thread.status }}</span>
          </div>
        </button>
      </aside>

      <section class="flex min-w-0 flex-col rounded-lg border border-black/10 bg-white">
        <div class="flex items-center gap-3 border-b border-black/10 px-5 py-4">
          <div class="grid size-10 place-items-center rounded-lg bg-soft-cream text-nature-green">
            <MessageCircle class="size-5" />
          </div>
          <div class="min-w-0">
            <h3 class="truncate text-base font-bold text-deep-charcoal">{{ activeThread.name }}</h3>
            <p class="truncate text-sm font-medium text-muted-gray">{{ activeThread.subject }}</p>
          </div>
        </div>

        <div class="flex-1 space-y-3 overflow-y-auto p-5">
          <div
            v-for="(message, index) in activeThread.messages"
            :key="index"
            class="flex"
            :class="message.from === 'admin' ? 'justify-end' : 'justify-start'"
          >
            <p
              class="max-w-[78%] rounded-lg px-4 py-3 text-sm leading-6"
              :class="message.from === 'admin' ? 'bg-nature-green text-white' : 'bg-soft-cream text-deep-charcoal'"
            >
              {{ message.text }}
            </p>
          </div>
        </div>

        <form class="flex gap-3 border-t border-black/10 p-4" @submit.prevent="sendReply">
          <input
            v-model="reply"
            class="h-11 min-w-0 flex-1 rounded-lg border border-black/10 bg-soft-cream px-3 text-sm outline-none focus:border-soft-gold focus:bg-white"
            type="text"
            placeholder="Balas pesan"
          />
          <button class="grid size-11 place-items-center rounded-lg bg-nature-green text-white transition hover:bg-deep-charcoal" type="submit" aria-label="Kirim pesan">
            <Send class="size-4" />
          </button>
        </form>
      </section>
    </div>
  </div>
</template>
