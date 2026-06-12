<script setup>
import { LoaderCircle, MessageCircle, Send } from 'lucide-vue-next'
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import {
  getAdminConversations,
  getConversationMessages,
  markConversationMessagesRead,
  sendMessage,
  subscribeToCustomerMessages,
  unsubscribeChannel,
  updateConversationStatus,
} from '../../services/customerServiceChatService'

const conversations = ref([])
const activeConversationId = ref(null)
const messages = ref([])
const reply = ref('')
const isLoading = ref(true)
const isSending = ref(false)
const errorMessage = ref('')
let adminChannel = null

const activeConversation = computed(() => (
  conversations.value.find((conversation) => conversation.id === activeConversationId.value) || null
))

const totalUnread = computed(() => conversations.value.reduce((total, conversation) => (
  total + Number(conversation.unread_count || 0)
), 0))

function formatTime(value) {
  if (!value) return '-'
  return new Intl.DateTimeFormat('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: 'short',
  }).format(new Date(value))
}

async function loadConversations({ keepActive = false } = {}) {
  isLoading.value = true
  errorMessage.value = ''

  try {
    conversations.value = await getAdminConversations()

    if (!keepActive || !activeConversationId.value) {
      activeConversationId.value = conversations.value[0]?.id || null
    }
  } catch (error) {
    errorMessage.value = error?.message || 'Gagal memuat percakapan customer service.'
  } finally {
    isLoading.value = false
  }
}

async function loadMessages(conversationId) {
  if (!conversationId) {
    messages.value = []
    return
  }

  messages.value = await getConversationMessages(conversationId)
  await markConversationMessagesRead(conversationId, 'user').catch(() => {})

  conversations.value = conversations.value.map((conversation) => (
    conversation.id === conversationId
      ? { ...conversation, unread_count: 0 }
      : conversation
  ))
}

async function selectConversation(conversation) {
  activeConversationId.value = conversation.id
  await loadMessages(conversation.id)
}

function appendRealtimeMessage(message) {
  conversations.value = conversations.value.map((conversation) => {
    if (conversation.id !== message.conversation_id) return conversation

    return {
      ...conversation,
      last_message: message.message,
      updated_at: message.created_at,
      unread_count: activeConversationId.value === message.conversation_id || message.sender_type === 'admin'
        ? conversation.unread_count
        : Number(conversation.unread_count || 0) + 1,
    }
  })

  if (activeConversationId.value === message.conversation_id) {
    if (!messages.value.some((item) => item.id === message.id)) {
      messages.value = [...messages.value, message]
    }
    if (message.sender_type === 'user') {
      markConversationMessagesRead(message.conversation_id, 'user').catch(() => {})
    }
  } else {
    conversations.value = [...conversations.value].sort((left, right) => (
      new Date(right.updated_at || 0) - new Date(left.updated_at || 0)
    ))
  }
}

async function sendReply() {
  if (!reply.value.trim() || !activeConversation.value || isSending.value) return

  isSending.value = true
  errorMessage.value = ''

  try {
    const message = await sendMessage({
      conversationId: activeConversation.value.id,
      senderType: 'admin',
      message: reply.value.trim(),
    })

    appendRealtimeMessage(message)
    reply.value = ''
    await loadConversations({ keepActive: true })
  } catch (error) {
    errorMessage.value = error?.message || 'Gagal mengirim balasan.'
  } finally {
    isSending.value = false
  }
}

async function changeStatus(status) {
  if (!activeConversation.value) return

  const updated = await updateConversationStatus(activeConversation.value.id, status)
  conversations.value = conversations.value.map((conversation) => (
    conversation.id === updated.id
      ? { ...conversation, ...updated }
      : conversation
  ))
}

watch(activeConversationId, (conversationId) => {
  loadMessages(conversationId).catch((error) => {
    errorMessage.value = error?.message || 'Gagal memuat pesan.'
  })
})

onMounted(async () => {
  await loadConversations()
  adminChannel = subscribeToCustomerMessages({
    onInsert: appendRealtimeMessage,
  })
})

onBeforeUnmount(() => {
  unsubscribeChannel(adminChannel)
})
</script>

<template>
  <div class="space-y-5">
    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 class="text-xl font-bold text-deep-charcoal">Customer Service</h2>
        <p class="mt-1 text-sm font-medium text-muted-gray">Kelola percakapan pengunjung secara realtime.</p>
      </div>
      <div class="rounded-lg border border-black/10 bg-white px-4 py-2 text-sm font-bold text-deep-charcoal">
        Pesan Baru
        <span class="ml-2 rounded-full bg-red-600 px-2 py-0.5 text-xs text-white">{{ totalUnread }}</span>
      </div>
    </div>

    <div v-if="errorMessage" class="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
      {{ errorMessage }}
    </div>

    <div v-if="isLoading" class="rounded-lg border border-black/10 bg-white p-6 text-sm font-semibold text-muted-gray">
      Memuat customer service...
    </div>

    <div v-else class="grid min-h-[38rem] gap-5 xl:grid-cols-[24rem_1fr]">
      <aside class="overflow-hidden rounded-lg border border-black/10 bg-white">
        <div class="border-b border-black/10 px-4 py-3">
          <h3 class="text-sm font-bold uppercase tracking-[0.14em] text-muted-gray">Percakapan</h3>
        </div>

        <button
          v-for="conversation in conversations"
          :key="conversation.id"
          class="block w-full border-b border-black/10 px-4 py-4 text-left transition hover:bg-soft-cream"
          :class="conversation.id === activeConversationId ? 'bg-soft-cream' : 'bg-white'"
          type="button"
          @click="selectConversation(conversation)"
        >
          <div class="flex items-start justify-between gap-3">
            <div class="min-w-0">
              <p class="truncate text-sm font-bold text-deep-charcoal">{{ conversation.visitor_name }}</p>
              <p class="mt-1 truncate text-xs font-semibold text-muted-gray">{{ conversation.visitor_email }}</p>
              <p class="mt-2 truncate text-xs text-muted-gray">{{ conversation.last_message || 'Belum ada pesan' }}</p>
            </div>
            <div class="shrink-0 text-right">
              <span class="rounded-lg bg-white px-2 py-1 text-[0.68rem] font-bold uppercase text-nature-green">{{ conversation.status }}</span>
              <span v-if="conversation.unread_count" class="mt-2 inline-grid size-6 place-items-center rounded-full bg-red-600 text-xs font-bold text-white">
                {{ conversation.unread_count }}
              </span>
            </div>
          </div>
        </button>

        <div v-if="!conversations.length" class="p-6 text-center text-sm font-medium text-muted-gray">
          Belum ada percakapan.
        </div>
      </aside>

      <section class="flex min-w-0 flex-col rounded-lg border border-black/10 bg-white">
        <template v-if="activeConversation">
          <div class="flex flex-col gap-3 border-b border-black/10 px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
            <div class="flex min-w-0 items-center gap-3">
              <div class="grid size-10 shrink-0 place-items-center rounded-lg bg-soft-cream text-nature-green">
                <MessageCircle class="size-5" />
              </div>
              <div class="min-w-0">
                <h3 class="truncate text-base font-bold text-deep-charcoal">{{ activeConversation.visitor_name }}</h3>
                <p class="truncate text-sm font-medium text-muted-gray">{{ activeConversation.visitor_email }}</p>
              </div>
            </div>

            <select
              class="h-10 rounded-lg border border-black/10 bg-soft-cream px-3 text-sm font-bold text-deep-charcoal outline-none"
              :value="activeConversation.status"
              @change="changeStatus($event.target.value)"
            >
              <option value="open">Open</option>
              <option value="waiting">Waiting</option>
              <option value="closed">Closed</option>
            </select>
          </div>

          <div class="flex-1 space-y-3 overflow-y-auto bg-[#F8F6F0] p-5">
            <div
              v-for="message in messages"
              :key="message.id"
              class="flex"
              :class="message.sender_type === 'admin' ? 'justify-end' : 'justify-start'"
            >
              <div
                class="max-w-[78%] rounded-lg px-4 py-3 text-sm leading-6 shadow-sm"
                :class="message.sender_type === 'admin' ? 'bg-nature-green text-white' : 'bg-white text-deep-charcoal'"
              >
                <p>{{ message.message }}</p>
                <p class="mt-2 text-[0.68rem] opacity-65">{{ formatTime(message.created_at) }}</p>
              </div>
            </div>
          </div>

          <form class="flex gap-3 border-t border-black/10 p-4" @submit.prevent="sendReply">
            <input
              v-model="reply"
              class="h-11 min-w-0 flex-1 rounded-lg border border-black/10 bg-soft-cream px-3 text-sm outline-none focus:border-soft-gold focus:bg-white"
              type="text"
              placeholder="Balas pesan"
            />
            <button class="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-nature-green px-4 text-sm font-bold text-white transition hover:bg-deep-charcoal disabled:cursor-not-allowed disabled:opacity-60" type="submit" :disabled="isSending">
              <LoaderCircle v-if="isSending" class="size-4 animate-spin" />
              <Send v-else class="size-4" />
              Kirim
            </button>
          </form>
        </template>

        <div v-else class="grid flex-1 place-items-center p-8 text-center text-sm font-medium text-muted-gray">
          Pilih percakapan untuk mulai membalas.
        </div>
      </section>
    </div>
  </div>
</template>
