<script setup>
import { Edit3, Plus, Trash2 } from 'lucide-vue-next'
import { onMounted, ref } from 'vue'
import ConfirmDelete from '../../components/admin/ConfirmDelete.vue'
import DataTable from '../../components/admin/DataTable.vue'
import ModalForm from '../../components/admin/ModalForm.vue'
import {
  createAdminRecord,
  deleteAdminRecord,
  getAdminCollection,
  updateAdminRecord,
} from '../../services/adminService'

const categories = ref([])
const isLoading = ref(true)
const modalOpen = ref(false)
const selectedCategory = ref(null)
const deleteTarget = ref(null)

const columns = [
  { key: 'name', label: 'Nama' },
  { key: 'icon', label: 'Icon' },
]

const fields = [
  { key: 'name', label: 'Nama', required: true },
  { key: 'icon', label: 'Icon', placeholder: 'Contoh: Landmark', required: true },
]

async function loadCategories() {
  isLoading.value = true
  categories.value = await getAdminCollection('categories')
  isLoading.value = false
}

function openCreateModal() {
  selectedCategory.value = null
  modalOpen.value = true
}

function openEditModal(category) {
  selectedCategory.value = { ...category }
  modalOpen.value = true
}

async function handleSubmit(payload) {
  if (selectedCategory.value?.id) {
    const updated = await updateAdminRecord('categories', selectedCategory.value.id, payload)
    categories.value = categories.value.map((category) => (
      category.id === selectedCategory.value.id ? updated : category
    ))
  } else {
    const created = await createAdminRecord('categories', payload)
    categories.value = [created, ...categories.value]
  }

  modalOpen.value = false
}

async function confirmDelete() {
  await deleteAdminRecord('categories', deleteTarget.value.id)
  categories.value = categories.value.filter((category) => category.id !== deleteTarget.value.id)
  deleteTarget.value = null
}

onMounted(loadCategories)
</script>

<template>
  <div class="space-y-5">
    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 class="text-xl font-bold text-deep-charcoal">Categories Management</h2>
        <p class="mt-1 text-sm font-medium text-muted-gray">Kelola kategori wisata dan icon tampilan.</p>
      </div>
      <button class="inline-flex items-center justify-center gap-2 rounded-lg bg-nature-green px-4 py-2.5 text-sm font-bold text-white transition hover:bg-deep-charcoal" type="button" @click="openCreateModal">
        <Plus class="size-4" />
        Tambah Kategori
      </button>
    </div>

    <div v-if="isLoading" class="rounded-lg border border-black/10 bg-white p-6 text-sm font-semibold text-muted-gray">
      Memuat kategori...
    </div>

    <DataTable v-else :columns="columns" :items="categories">
      <template #cell-icon="{ value }">
        <span class="rounded-lg bg-soft-cream px-2.5 py-1 text-xs font-bold text-nature-green">{{ value }}</span>
      </template>
      <template #actions="{ item }">
        <div class="inline-flex items-center gap-2">
          <button class="grid size-9 place-items-center rounded-lg border border-black/10 text-muted-gray transition hover:border-soft-gold hover:text-nature-green" type="button" aria-label="Edit kategori" @click="openEditModal(item)">
            <Edit3 class="size-4" />
          </button>
          <button class="grid size-9 place-items-center rounded-lg border border-black/10 text-muted-gray transition hover:border-red-200 hover:bg-red-50 hover:text-red-600" type="button" aria-label="Hapus kategori" @click="deleteTarget = item">
            <Trash2 class="size-4" />
          </button>
        </div>
      </template>
    </DataTable>

    <ModalForm
      :open="modalOpen"
      :title="selectedCategory ? 'Edit Kategori' : 'Tambah Kategori'"
      :fields="fields"
      :model-value="selectedCategory || {}"
      submit-label="Simpan Kategori"
      @close="modalOpen = false"
      @submit="handleSubmit"
    />

    <ConfirmDelete
      :open="Boolean(deleteTarget)"
      title="Hapus kategori?"
      :message="`Kategori ${deleteTarget?.name || ''} akan dihapus.`"
      @cancel="deleteTarget = null"
      @confirm="confirmDelete"
    />
  </div>
</template>
