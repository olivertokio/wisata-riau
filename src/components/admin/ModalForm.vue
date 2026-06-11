<script setup>
import { X } from 'lucide-vue-next'
import { reactive, watch } from 'vue'

const props = defineProps({
  open: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    required: true,
  },
  fields: {
    type: Array,
    required: true,
  },
  modelValue: {
    type: Object,
    default: () => ({}),
  },
  submitLabel: {
    type: String,
    default: 'Simpan',
  },
})

const emit = defineEmits(['close', 'submit'])
const form = reactive({})

function resetForm() {
  props.fields.forEach((field) => {
    form[field.key] = props.modelValue?.[field.key] ?? field.default ?? ''
  })
}

watch(
  () => [props.open, props.modelValue],
  resetForm,
  { immediate: true, deep: true },
)

function handleSubmit() {
  emit('submit', { ...props.modelValue, ...form })
}
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
      <div v-if="open" class="fixed inset-0 z-50 grid place-items-center bg-deep-charcoal/35 px-4 py-6">
        <form class="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-lg bg-white shadow-2xl" @submit.prevent="handleSubmit">
          <div class="flex items-center justify-between border-b border-black/10 px-5 py-4">
            <h2 class="text-lg font-bold text-deep-charcoal">{{ title }}</h2>
            <button
              class="grid size-10 place-items-center rounded-lg border border-black/10 text-muted-gray"
              type="button"
              aria-label="Tutup modal"
              @click="$emit('close')"
            >
              <X class="size-5" />
            </button>
          </div>

          <div class="grid gap-4 p-5 sm:grid-cols-2">
            <label
              v-for="field in fields"
              :key="field.key"
              class="block"
              :class="field.type === 'textarea' || field.full ? 'sm:col-span-2' : ''"
            >
              <span class="mb-2 block text-sm font-bold text-deep-charcoal">{{ field.label }}</span>

              <textarea
                v-if="field.type === 'textarea'"
                v-model="form[field.key]"
                class="min-h-28 w-full resize-y rounded-lg border border-black/10 bg-soft-cream px-3 py-3 text-sm outline-none focus:border-soft-gold focus:bg-white"
                :placeholder="field.placeholder"
                :required="field.required"
              />

              <select
                v-else-if="field.type === 'select'"
                v-model="form[field.key]"
                class="h-11 w-full rounded-lg border border-black/10 bg-soft-cream px-3 text-sm outline-none focus:border-soft-gold focus:bg-white"
                :required="field.required"
              >
                <option value="" disabled>Pilih {{ field.label }}</option>
                <option v-for="option in field.options" :key="option.value" :value="option.value">
                  {{ option.label }}
                </option>
              </select>

              <input
                v-else
                v-model="form[field.key]"
                class="h-11 w-full rounded-lg border border-black/10 bg-soft-cream px-3 text-sm outline-none focus:border-soft-gold focus:bg-white"
                :type="field.type || 'text'"
                :step="field.step"
                :placeholder="field.placeholder"
                :required="field.required"
              />
            </label>
          </div>

          <div class="flex justify-end gap-3 border-t border-black/10 px-5 py-4">
            <button
              class="rounded-lg border border-black/10 px-4 py-2 text-sm font-bold text-muted-gray transition hover:bg-soft-cream"
              type="button"
              @click="$emit('close')"
            >
              Batal
            </button>
            <button class="rounded-lg bg-nature-green px-4 py-2 text-sm font-bold text-white transition hover:bg-deep-charcoal" type="submit">
              {{ submitLabel }}
            </button>
          </div>
        </form>
      </div>
    </Transition>
  </Teleport>
</template>
