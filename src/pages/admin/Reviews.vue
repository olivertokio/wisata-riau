<script setup>
import { Edit3, Plus, Trash2 } from 'lucide-vue-next'
import { computed, onMounted, ref } from 'vue'
import ConfirmDelete from '../../components/admin/ConfirmDelete.vue'
import DataTable from '../../components/admin/DataTable.vue'
import ModalForm from '../../components/admin/ModalForm.vue'
import {
  getAdminReviews,
  createAdminReview,
  updateAdminReview,
  deleteAdminReview,
} from '../../services/adminReviewService'

const reviews = ref([])
const ratingFilter = ref('all')
const isLoading = ref(true)
const isSubmitting = ref(false)
const modalOpen = ref(false)
const selectedReview = ref(null)
const deleteTarget = ref(null)
const errorMessage = ref('')
const successMessage = ref('')

const columns = [
  { key: 'name', label: 'Pengguna' },
  { key: 'destination_id', label: 'ID Destinasi' },
  { key: 'rating', label: 'Rating' },
  { key: 'comment', label: 'Komentar' },
  { key: 'created_at', label: 'Tanggal', formatter: formatDate },
]

const filteredReviews = computed(() => {
  if (ratingFilter.value === 'all') return reviews.value
  return reviews.value.filter((review) => Number(review.rating) === Number(ratingFilter.value))
})

const fields = computed(() => [
  { key: 'name', label: 'Nama Pengguna', required: true },
  {
    key: 'destination_id',
    label: 'ID Destinasi',
    type: 'number',
    required: true,
  },
  {
    key: 'rating',
    label: 'Rating',
    type: 'number',
    step: '1',
    min: '1',
    max: '5',
    default: 5,
    required: true,
  },
  { key: 'comment', label: 'Komentar', type: 'textarea', required: true },
])

function formatDate(value) {
  if (!value) return '-'

  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value))
}

function normalizeReview(review) {
  return {
    id: review.id,
    destination_id: review.destination_id,
    name: review.name || '-',
    rating: Number(review.rating || 0),
    comment: review.comment || '-',
    created_at: review.created_at,
  }
}

function resetMessages() {
  errorMessage.value = ''
  successMessage.value = ''
}

async function loadReviews() {
  isLoading.value = true
  resetMessages()

  try {
    const data = await getAdminReviews()
    reviews.value = (data || []).map(normalizeReview)
  } catch (error) {
    console.error(error)
    errorMessage.value = error.message || 'Gagal memuat data ulasan.'
  } finally {
    isLoading.value = false
  }
}

function openCreateModal() {
  selectedReview.value = null
  modalOpen.value = true
}

function openEditModal(review) {
  selectedReview.value = { ...review }
  modalOpen.value = true
}

function openDeleteModal(review) {
  deleteTarget.value = review
}

async function handleSubmit(payload) {
  resetMessages()
  isSubmitting.value = true

  try {
    const record = {
      destination_id: Number(payload.destination_id),
      name: payload.name,
      rating: Number(payload.rating),
      comment: payload.comment,
    }

    if (selectedReview.value?.id) {
      const updated = await updateAdminReview(selectedReview.value.id, record)

      reviews.value = reviews.value.map((review) =>
        review.id === selectedReview.value.id ? normalizeReview(updated) : review
      )

      successMessage.value = 'Ulasan berhasil diperbarui.'
    } else {
      const created = await createAdminReview(record)
      reviews.value = [normalizeReview(created), ...reviews.value]

      successMessage.value = 'Ulasan berhasil ditambahkan.'
    }

    modalOpen.value = false
    selectedReview.value = null
  } catch (error) {
    console.error(error)
    errorMessage.value = error.message || 'Gagal menyimpan ulasan.'
  } finally {
    isSubmitting.value = false
  }
}

async function confirmDelete() {
  if (!deleteTarget.value?.id) return

  console.log('DELETE TARGET:', deleteTarget.value)

  resetMessages()
  isSubmitting.value = true

  try {
    const targetId = deleteTarget.value.id

    const result = await deleteAdminReview(targetId)

    console.log('DELETE SUPABASE RESULT:', result)

    reviews.value = reviews.value.filter((review) => review.id !== targetId)
    deleteTarget.value = null
    successMessage.value = 'Ulasan berhasil dihapus.'
  } catch (error) {
    console.error('DELETE ERROR:', error)
    errorMessage.value = error.message || 'Gagal menghapus ulasan.'
  } finally {
    isSubmitting.value = false
  }
}

function cancelDelete() {
  deleteTarget.value = null
}

onMounted(loadReviews)
</script>

<template>
  <div class="space-y-5">
    <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div>
        <h2 class="text-xl font-bold text-deep-charcoal">Reviews Management</h2>
        <p class="mt-1 text-sm font-medium text-muted-gray">
          CRUD tabel reviews menggunakan Supabase.
        </p>
      </div>

      <div class="flex flex-col gap-3 sm:flex-row">
        <label class="flex w-full items-center gap-3 rounded-lg border border-black/10 bg-white px-3 py-2 sm:w-56">
          <span class="text-sm font-bold text-muted-gray">Rating</span>
          <select
            v-model="ratingFilter"
            class="min-w-0 flex-1 bg-transparent text-sm font-semibold outline-none"
          >
            <option value="all">Semua</option>
            <option v-for="rating in [5, 4, 3, 2, 1]" :key="rating" :value="rating">
              {{ rating }} bintang
            </option>
          </select>
        </label>

        <button
          class="inline-flex items-center justify-center gap-2 rounded-lg bg-nature-green px-4 py-2.5 text-sm font-bold text-white transition hover:bg-deep-charcoal disabled:cursor-not-allowed disabled:opacity-60"
          type="button"
          :disabled="isSubmitting || isLoading"
          @click="openCreateModal"
        >
          <Plus class="size-4" />
          Tambah Ulasan
        </button>
      </div>
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

    <div
      v-if="isLoading"
      class="rounded-lg border border-black/10 bg-white p-6 text-sm font-semibold text-muted-gray"
    >
      Memuat reviews dari Supabase...
    </div>

    <DataTable
      v-else
      :columns="columns"
      :items="filteredReviews"
      empty-text="Belum ada data reviews."
    >
      <template #cell-rating="{ value }">
        <span class="rounded-lg bg-soft-cream px-2.5 py-1 text-xs font-bold text-soft-gold">
          {{ value }} / 5
        </span>
      </template>

      <template #cell-comment="{ value }">
        <span class="block max-w-md whitespace-normal leading-6">{{ value }}</span>
      </template>

      <template #actions="{ item }">
        <div class="inline-flex items-center gap-2">
          <button
            class="grid size-9 place-items-center rounded-lg border border-black/10 text-muted-gray transition hover:border-soft-gold hover:text-nature-green disabled:cursor-not-allowed disabled:opacity-50"
            type="button"
            aria-label="Edit ulasan"
            :disabled="isSubmitting"
            @click="openEditModal(item)"
          >
            <Edit3 class="size-4" />
          </button>

          <button
            class="grid size-9 place-items-center rounded-lg border border-black/10 text-muted-gray transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
            type="button"
            aria-label="Hapus ulasan"
            :disabled="isSubmitting"
            @click="openDeleteModal(item)"
          >
            <Trash2 class="size-4" />
          </button>
        </div>
      </template>
    </DataTable>

    <ModalForm
      :open="modalOpen"
      :title="selectedReview ? 'Edit Ulasan' : 'Tambah Ulasan'"
      :fields="fields"
      :model-value="selectedReview || {}"
      :submit-label="isSubmitting ? 'Menyimpan...' : 'Simpan Ulasan'"
      @close="modalOpen = false"
      @submit="handleSubmit"
    />

    <ConfirmDelete
      :open="Boolean(deleteTarget)"
      title="Hapus ulasan?"
      :message="`Ulasan dari ${deleteTarget?.name || 'pengguna'} akan dihapus dari Supabase.`"
      @cancel="cancelDelete"
      @confirm="confirmDelete"
    />
  </div>
</template>