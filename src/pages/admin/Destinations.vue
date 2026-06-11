<script setup>
import { Edit3, Plus, Trash2 } from 'lucide-vue-next'
import { onMounted, ref } from 'vue'
import ConfirmDelete from '../../components/admin/ConfirmDelete.vue'
import DataTable from '../../components/admin/DataTable.vue'
import ModalForm from '../../components/admin/ModalForm.vue'
import {
  createAdminDestination,
  deleteAdminDestination,
  fetchAdminDestinations,
  updateAdminDestination,
} from '../../services/adminDestinationService'

const destinations = ref([])
const isLoading = ref(false)
const isSubmitting = ref(false)
const modalOpen = ref(false)
const selectedDestination = ref(null)
const deleteTarget = ref(null)
const successMessage = ref('')
const errorMessage = ref('')

const columns = [
  { key: 'image', label: 'Thumbnail' },
  { key: 'name', label: 'Name' },
  { key: 'category_id', label: 'Category ID' },
  { key: 'location', label: 'Location' },
  { key: 'rating', label: 'Rating' },
  { key: 'views', label: 'Views' },
]

const fields = [
  { key: 'name', label: 'Name', required: true },
  { key: 'slug', label: 'Slug', required: true },
  { key: 'category_id', label: 'Category ID', type: 'number', required: true },
  { key: 'location', label: 'Location', required: true },
  { key: 'image', label: 'Image URL', type: 'url', full: true, required: true },
  { key: 'description', label: 'Description', type: 'textarea', required: true },
  { key: 'latitude', label: 'Latitude', type: 'number', step: '0.000001', required: true },
  { key: 'longitude', label: 'Longitude', type: 'number', step: '0.000001', required: true },
  { key: 'rating', label: 'Rating', type: 'number', step: '0.1', default: 0 },
  { key: 'views', label: 'Views', type: 'number', default: 0 },
]

function clearMessages() {
  successMessage.value = ''
  errorMessage.value = ''
}

function setError(error, fallbackMessage) {
  errorMessage.value = error?.message || fallbackMessage
}

async function loadDestinations({ resetMessages = true } = {}) {
  isLoading.value = true
  if (resetMessages) {
    clearMessages()
  }

  try {
    destinations.value = await fetchAdminDestinations()
  } catch (error) {
    destinations.value = []
    setError(error, 'Gagal mengambil data destinations dari Supabase.')
  } finally {
    isLoading.value = false
  }
}

function openCreateModal() {
  clearMessages()
  selectedDestination.value = null
  modalOpen.value = true
}

function openEditModal(destination) {
  clearMessages()
  selectedDestination.value = { ...destination }
  modalOpen.value = true
}

async function handleSubmit(payload) {
  if (isSubmitting.value) return

  isSubmitting.value = true
  clearMessages()

  try {
    if (selectedDestination.value?.id) {
      await updateAdminDestination(selectedDestination.value.id, payload)
      await loadDestinations({ resetMessages: false })
      successMessage.value = 'Destinasi berhasil diperbarui.'
    } else {
      await createAdminDestination(payload)
      await loadDestinations({ resetMessages: false })
      successMessage.value = 'Destinasi berhasil ditambahkan.'
    }

    modalOpen.value = false
    selectedDestination.value = null
  } catch (error) {
    setError(error, 'Gagal menyimpan destinasi.')
  } finally {
    isSubmitting.value = false
  }
}

async function confirmDelete() {
  if (!deleteTarget.value?.id || isSubmitting.value) return

  isSubmitting.value = true
  clearMessages()

  try {
    await deleteAdminDestination(deleteTarget.value.id)
    await loadDestinations({ resetMessages: false })
    successMessage.value = 'Destinasi berhasil dihapus.'
    deleteTarget.value = null
  } catch (error) {
    setError(error, 'Gagal menghapus destinasi.')
  } finally {
    isSubmitting.value = false
  }
}

onMounted(loadDestinations)
</script>

<template>
  <div class="space-y-5">
    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 class="text-xl font-bold text-deep-charcoal">Destinations Management</h2>
        <p class="mt-1 text-sm font-medium text-muted-gray">CRUD tabel destinations menggunakan Supabase.</p>
      </div>

      <button
        class="inline-flex items-center justify-center gap-2 rounded-lg bg-nature-green px-4 py-2.5 text-sm font-bold text-white transition hover:bg-deep-charcoal disabled:cursor-not-allowed disabled:opacity-60"
        type="button"
        :disabled="isSubmitting"
        @click="openCreateModal"
      >
        <Plus class="size-4" />
        Tambah Destinasi
      </button>
    </div>

    <div
      v-if="successMessage"
      class="rounded-lg border border-nature-green/20 bg-green-50 px-4 py-3 text-sm font-semibold text-nature-green"
    >
      {{ successMessage }}
    </div>

    <div
      v-if="errorMessage"
      class="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700"
    >
      {{ errorMessage }}
    </div>

    <div v-if="isLoading" class="rounded-lg border border-black/10 bg-white p-6 text-sm font-semibold text-muted-gray">
      Memuat destinations dari Supabase...
    </div>

    <DataTable v-else :columns="columns" :items="destinations" empty-text="Belum ada data destinations.">
      <template #cell-image="{ item }">
        <img
          v-if="item.image"
          class="size-14 rounded-lg object-cover"
          :src="item.image"
          :alt="item.name"
        />
        <div v-else class="grid size-14 place-items-center rounded-lg bg-soft-cream text-xs font-bold text-muted-gray">
          No Img
        </div>
      </template>

      <template #cell-category_id="{ value }">
        <span class="rounded-lg bg-soft-cream px-2.5 py-1 text-xs font-bold text-nature-green">{{ value }}</span>
      </template>

      <template #cell-rating="{ value }">
        <span class="font-semibold text-soft-gold">{{ value ?? 0 }}</span>
      </template>

      <template #actions="{ item }">
        <div class="inline-flex items-center gap-2">
          <button
            class="grid size-9 place-items-center rounded-lg border border-black/10 text-muted-gray transition hover:border-soft-gold hover:text-nature-green disabled:cursor-not-allowed disabled:opacity-50"
            type="button"
            aria-label="Edit destination"
            :disabled="isSubmitting"
            @click="openEditModal(item)"
          >
            <Edit3 class="size-4" />
          </button>

          <button
            class="grid size-9 place-items-center rounded-lg border border-black/10 text-muted-gray transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
            type="button"
            aria-label="Delete destination"
            :disabled="isSubmitting"
            @click="deleteTarget = item"
          >
            <Trash2 class="size-4" />
          </button>
        </div>
      </template>
    </DataTable>

    <ModalForm
      :open="modalOpen"
      :title="selectedDestination ? 'Edit Destination' : 'Tambah Destination'"
      :fields="fields"
      :model-value="selectedDestination || {}"
      :submit-label="isSubmitting ? 'Menyimpan...' : 'Simpan Destination'"
      @close="modalOpen = false"
      @submit="handleSubmit"
    />

    <ConfirmDelete
      :open="Boolean(deleteTarget)"
      title="Hapus destination?"
      :message="`Destination ${deleteTarget?.name || ''} akan dihapus dari Supabase.`"
      @cancel="deleteTarget = null"
      @confirm="confirmDelete"
    />
  </div>
</template>
