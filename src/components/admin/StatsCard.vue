<script setup>
defineProps({
  label: {
    type: String,
    required: true,
  },
  value: {
    type: [String, Number],
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  icon: {
    type: [Object, Function],
    required: true,
  },
})
</script>

<template>
  <article class="rounded-lg border border-black/10 bg-white p-5 shadow-sm">
    <div class="flex items-start justify-between gap-4">
      <div>
        <p class="text-sm font-semibold text-muted-gray">{{ label }}</p>
        <p class="mt-3 text-3xl font-bold text-deep-charcoal">{{ value }}</p>
      </div>
      <div class="grid size-11 shrink-0 place-items-center rounded-lg bg-soft-cream text-nature-green">
        <component :is="icon" class="size-5" />
      </div>
    </div>
    <p v-if="description" class="mt-4 text-sm font-medium text-muted-gray">{{ description }}</p>
  </article>
</template>
