<script setup>
import { AlertTriangle } from 'lucide-vue-next'

defineProps({
  open: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: 'Hapus data?',
  },
  message: {
    type: String,
    default: 'Data yang dihapus tidak dapat dikembalikan.',
  },
})

defineEmits(['cancel', 'confirm'])
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="open" class="fixed inset-0 z-50 grid place-items-center bg-deep-charcoal/35 px-4">
        <section class="w-full max-w-md rounded-lg bg-white p-5 shadow-2xl">
          <div class="flex items-start gap-4">
            <div class="grid size-11 shrink-0 place-items-center rounded-lg bg-red-50 text-red-600">
              <AlertTriangle class="size-5" />
            </div>
            <div>
              <h2 class="text-lg font-bold text-deep-charcoal">{{ title }}</h2>
              <p class="mt-2 text-sm leading-6 text-muted-gray">{{ message }}</p>
            </div>
          </div>

          <div class="mt-6 flex justify-end gap-3">
            <button
              class="rounded-lg border border-black/10 px-4 py-2 text-sm font-bold text-muted-gray transition hover:bg-soft-cream"
              type="button"
              @click="$emit('cancel')"
            >
              Batal
            </button>
            <button class="rounded-lg bg-red-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-red-700" type="button" @click="$emit('confirm')">
              Hapus
            </button>
          </div>
        </section>
      </div>
    </Transition>
  </Teleport>
</template>
