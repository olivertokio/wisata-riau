<script setup>
defineProps({
  columns: {
    type: Array,
    required: true,
  },
  items: {
    type: Array,
    default: () => [],
  },
  emptyText: {
    type: String,
    default: 'Belum ada data.',
  },
})

function valueFor(item, column) {
  const value = item[column.key]
  if (column.formatter) return column.formatter(value, item)
  return value ?? '-'
}
</script>

<template>
  <div class="overflow-hidden rounded-lg border border-black/10 bg-white">
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-black/10 text-left">
        <thead class="bg-soft-cream">
          <tr>
            <th
              v-for="column in columns"
              :key="column.key"
              class="whitespace-nowrap px-4 py-3 text-xs font-bold uppercase tracking-[0.12em] text-muted-gray"
            >
              {{ column.label }}
            </th>
            <th
              v-if="$slots.actions"
              class="whitespace-nowrap px-4 py-3 text-right text-xs font-bold uppercase tracking-[0.12em] text-muted-gray"
            >
              Action
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-black/10">
          <tr v-if="!items.length">
            <td class="px-4 py-8 text-center text-sm font-medium text-muted-gray" :colspan="columns.length + ($slots.actions ? 1 : 0)">
              {{ emptyText }}
            </td>
          </tr>
          <tr v-for="item in items" :key="item.id" class="transition hover:bg-soft-cream/60">
            <td
              v-for="column in columns"
              :key="column.key"
              class="whitespace-nowrap px-4 py-4 align-middle text-sm text-deep-charcoal"
            >
              <slot :name="`cell-${column.key}`" :item="item" :value="item[column.key]">
                {{ valueFor(item, column) }}
              </slot>
            </td>
            <td v-if="$slots.actions" class="whitespace-nowrap px-4 py-4 text-right">
              <slot name="actions" :item="item" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
