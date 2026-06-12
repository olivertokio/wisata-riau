<script setup>
import { Headphones, LoaderCircle, Send, X } from 'lucide-vue-next'
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import {
  createConversation,
  getConversation,
  getConversationMessages,
  getUserOpenConversation,
  sendMessage,
  subscribeToCustomerMessages,
  unsubscribeChannel,
} from '../../services/customerServiceChatService'
import { useUserStore } from '../../stores/userStore'

const userStore = useUserStore()
const isOpen = ref(false)
const isLoading = ref(false)
const isSending = ref(false)
const errorMessage = ref('')
const conversation = ref(null)
const messages = ref([])
const draftMessage = ref('')
const messagesPanel = ref(null)
const guestForm = ref({
  name: '',
  email: '',
})
let messageChannel = null

const isLoggedIn = computed(() => userStore.isAuthenticated)
const needsGuestIdentity = computed(() => !isLoggedIn.value && !conversation.value)
const chatStatus = computed(() => (conversation.value?.status === 'closed' ? 'Offline' : 'Online'))

function saveGuestConversation(id) {
  localStorage.setItem('riauscape_guest_conversation_id', String(id))
}

function getGuestConversationId() {
  return localStorage.getItem('riauscape_guest_conversation_id')
}

function scrollToBottom() {
  nextTick(() => {
    if (messagesPanel.value) {
      messagesPanel.value.scrollTop = messagesPanel.value.scrollHeight
    }
  })
}

function appendRealtimeMessage(message) {
  if (messages.value.some((item) => item.id === message.id)) return
  messages.value = [...messages.value, message]
  scrollToBottom()
}

function subscribeConversation() {
  unsubscribeChannel(messageChannel)
  messageChannel = null

  if (!conversation.value?.id) return

  messageChannel = subscribeToCustomerMessages({
    conversationId: conversation.value.id,
    onInsert: appendRealtimeMessage,
  })
}

async function loadExistingConversation() {
  if (isLoggedIn.value && userStore.user?.id) {
    conversation.value = await getUserOpenConversation(userStore.user.id)
  } else {
    const guestConversationId = getGuestConversationId()
    conversation.value = guestConversationId ? await getConversation(guestConversationId) : null
  }

  if (conversation.value?.id) {
    messages.value = await getConversationMessages(conversation.value.id)
    subscribeConversation()
    scrollToBottom()
  }
}

async function openChat() {
  isOpen.value = true
  errorMessage.value = ''
  await userStore.initialize()

  try {
    isLoading.value = true
    await loadExistingConversation()
  } catch (error) {
    errorMessage.value = error?.message || 'Chat belum bisa dimuat.'
  } finally {
    isLoading.value = false
  }
}

function closeChat() {
  isOpen.value = false
}

async function ensureConversation() {
  if (conversation.value?.id) return conversation.value

  const visitorName = isLoggedIn.value
    ? userStore.user.full_name || userStore.user.name || 'Pengguna RiauScape'
    : guestForm.value.name.trim()
  const visitorEmail = isLoggedIn.value
    ? userStore.user.email
    : guestForm.value.email.trim()

  if (!visitorName || !visitorEmail) {
    throw new Error('Nama dan email wajib diisi.')
  }

  conversation.value = await createConversation({
    visitorName,
    visitorEmail,
    userId: userStore.user?.id || null,
  })

  if (!isLoggedIn.value) {
    saveGuestConversation(conversation.value.id)
  }

  subscribeConversation()
  return conversation.value
}

async function handleSend() {
  if (!draftMessage.value.trim() || isSending.value) return

  errorMessage.value = ''
  isSending.value = true

  try {
    const activeConversation = await ensureConversation()
    const message = await sendMessage({
      conversationId: activeConversation.id,
      senderType: 'user',
      message: draftMessage.value.trim(),
    })
    appendRealtimeMessage(message)
    draftMessage.value = ''
  } catch (error) {
    errorMessage.value = error?.message || 'Pesan gagal dikirim.'
  } finally {
    isSending.value = false
  }
}

watch(isOpen, (open) => {
  if (open) scrollToBottom()
})

onBeforeUnmount(() => {
  unsubscribeChannel(messageChannel)
})
</script>

<template>
  <div>
    <button
      class="fixed bottom-5 right-5 z-50 grid size-14 place-items-center rounded-full bg-nature-green text-white shadow-[0_18px_45px_rgba(47,107,79,0.28)] transition duration-300 hover:-translate-y-1 hover:bg-deep-charcoal sm:bottom-6 sm:right-6"
      type="button"
      aria-label="Buka customer service"
      @click="openChat"
    >
      <Headphones class="size-6" />
    </button>

    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="translate-y-5 opacity-0"
      enter-to-class="translate-y-0 opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="translate-y-0 opacity-100"
      leave-to-class="translate-y-5 opacity-0"
    >
      <section
        v-if="isOpen"
        class="fixed inset-x-0 bottom-0 z-[60] flex h-[88vh] flex-col rounded-t-[1.6rem] border border-black/10 bg-white shadow-2xl sm:bottom-24 sm:right-6 sm:left-auto sm:h-[650px] sm:w-[420px] sm:rounded-[1.4rem]"
      >
        <header class="flex items-center justify-between gap-4 border-b border-black/10 bg-nature-green px-5 py-4 text-white sm:rounded-t-[1.4rem]">
          <div>
            <h2 class="text-base font-bold">RiauScape Customer Service</h2>
            <p class="mt-1 text-xs font-semibold text-white/75">{{ chatStatus }}</p>
          </div>
          <button class="grid size-10 place-items-center rounded-full bg-white/12 transition hover:bg-white hover:text-deep-charcoal" type="button" aria-label="Tutup chat" @click="closeChat">
            <X class="size-5" />
          </button>
        </header>

        <div v-if="isLoading" class="grid flex-1 place-items-center text-sm font-semibold text-muted-gray">
          <span class="inline-flex items-center gap-2">
            <LoaderCircle class="size-4 animate-spin text-nature-green" />
            Memuat chat...
          </span>
        </div>

        <template v-else>
          <div v-if="needsGuestIdentity" class="space-y-4 border-b border-black/10 bg-soft-cream/70 p-5">
            <p class="text-sm font-semibold text-deep-charcoal">Isi data sebelum mulai chat.</p>
            <input v-model="guestForm.name" class="h-11 w-full rounded-lg border border-black/10 bg-white px-3 text-sm outline-none focus:border-soft-gold" type="text" placeholder="Nama" />
            <input v-model="guestForm.email" class="h-11 w-full rounded-lg border border-black/10 bg-white px-3 text-sm outline-none focus:border-soft-gold" type="email" placeholder="Email" />
          </div>

          <div ref="messagesPanel" class="flex-1 space-y-3 overflow-y-auto bg-[#F8F6F0] p-5">
            <div v-if="!messages.length" class="rounded-lg bg-white p-4 text-sm leading-6 text-muted-gray shadow-sm">
              Halo, ada yang bisa kami bantu tentang wisata Riau?
            </div>
            <div
              v-for="message in messages"
              :key="message.id"
              class="flex"
              :class="message.sender_type === 'user' ? 'justify-end' : 'justify-start'"
            >
              <p
                class="max-w-[82%] rounded-lg px-4 py-3 text-sm leading-6 shadow-sm"
                :class="message.sender_type === 'user' ? 'bg-nature-green text-white' : 'bg-white text-deep-charcoal'"
              >
                {{ message.message }}
              </p>
            </div>
          </div>

          <div v-if="errorMessage" class="border-t border-red-100 bg-red-50 px-5 py-3 text-sm font-semibold text-red-700">
            {{ errorMessage }}
          </div>

          <form class="flex gap-3 border-t border-black/10 bg-white p-4" @submit.prevent="handleSend">
            <input
              v-model="draftMessage"
              class="h-11 min-w-0 flex-1 rounded-lg border border-black/10 bg-soft-cream px-3 text-sm outline-none focus:border-soft-gold focus:bg-white"
              type="text"
              placeholder="Tulis pesan Anda..."
            />
            <button
              class="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-nature-green px-4 text-sm font-bold text-white transition hover:bg-deep-charcoal disabled:cursor-not-allowed disabled:opacity-60"
              type="submit"
              :disabled="isSending"
            >
              <LoaderCircle v-if="isSending" class="size-4 animate-spin" />
              <Send v-else class="size-4" />
              <span class="hidden sm:inline">Kirim</span>
            </button>
          </form>
        </template>
      </section>
    </Transition>
  </div>
</template>
