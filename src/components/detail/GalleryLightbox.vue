<script setup>
import { ChevronLeft, ChevronRight, X } from 'lucide-vue-next'
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'

const props = defineProps({
  images: {
    type: Array,
    required: true,
  },
  currentIndex: {
    type: Number,
    default: 0,
  },
  open: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['close', 'next', 'prev'])
const touchStartX = ref(0)
const touchEndX = ref(0)

const activeImage = computed(() => props.images[props.currentIndex] || null)

function closeLightbox() {
  emit('close')
}

function handleKeydown(event) {
  if (!props.open) {
    return
  }

  if (event.key === 'Escape') {
    closeLightbox()
    return
  }

  if (event.key === 'ArrowRight') {
    emit('next')
    return
  }

  if (event.key === 'ArrowLeft') {
    emit('prev')
  }
}

function handleTouchStart(event) {
  touchStartX.value = event.changedTouches[0]?.screenX || 0
}

function handleTouchEnd(event) {
  touchEndX.value = event.changedTouches[0]?.screenX || 0
  const delta = touchStartX.value - touchEndX.value

  if (Math.abs(delta) < 50) {
    return
  }

  if (delta > 0) {
    emit('next')
    return
  }

  emit('prev')
}

watch(
  () => props.open,
  (isOpen) => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
  },
)

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onBeforeUnmount(() => {
  document.body.style.overflow = ''
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <Transition
    enter-active-class="transition duration-300 ease-out"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition duration-200 ease-in"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="open && activeImage"
      class="fixed inset-0 z-[120] bg-[rgba(7,11,10,0.92)] backdrop-blur-md"
      @click.self="closeLightbox"
    >
      <div class="flex min-h-screen items-center justify-center px-4 py-6 sm:px-6">
        <div class="relative w-full max-w-6xl">
          <button
            class="absolute right-0 top-0 z-20 inline-grid size-12 -translate-y-16 place-items-center rounded-full border border-white/15 bg-white/10 text-white backdrop-blur-xl transition duration-300 hover:bg-white hover:text-deep-charcoal sm:-translate-y-18"
            type="button"
            aria-label="Tutup galeri"
            @click="closeLightbox"
          >
            <X class="size-5" />
          </button>

          <div
            class="overflow-hidden rounded-[2rem] border border-white/12 bg-white/6 shadow-[0_35px_120px_rgba(0,0,0,0.35)] backdrop-blur-xl"
            @touchstart.passive="handleTouchStart"
            @touchend.passive="handleTouchEnd"
          >
            <div class="relative">
              <img
                class="max-h-[78vh] w-full object-cover"
                :src="activeImage.src"
                :alt="activeImage.alt"
              />
              <div class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent px-5 pb-5 pt-14 sm:px-7 sm:pb-7">
                <p class="text-xs font-semibold uppercase tracking-[0.24em] text-soft-gold">{{ activeImage.eyebrow }}</p>
                <h3 class="mt-3 font-serif text-2xl font-semibold text-white sm:text-3xl">{{ activeImage.title }}</h3>
                <p class="mt-2 max-w-2xl text-sm leading-7 text-white/72 sm:text-base">{{ activeImage.caption }}</p>
              </div>
            </div>
          </div>

          <div class="mt-4 flex items-center justify-between gap-3">
            <button
              class="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/10 px-4 py-3 text-sm font-semibold text-white backdrop-blur-xl transition duration-300 hover:bg-white hover:text-deep-charcoal"
              type="button"
              @click="$emit('prev')"
            >
              <ChevronLeft class="size-4" />
              Sebelumnya
            </button>

            <div class="rounded-full border border-white/12 bg-white/8 px-4 py-2 text-sm font-medium text-white/78 backdrop-blur-xl">
              {{ currentIndex + 1 }} / {{ images.length }}
            </div>

            <button
              class="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/10 px-4 py-3 text-sm font-semibold text-white backdrop-blur-xl transition duration-300 hover:bg-white hover:text-deep-charcoal"
              type="button"
              @click="$emit('next')"
            >
              Berikutnya
              <ChevronRight class="size-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>
