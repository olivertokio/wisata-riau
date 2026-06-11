<script setup>
import { Edit3, Eye, Plus, Trash2 } from 'lucide-vue-next'
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

const tripPlans = ref([])
const isLoading = ref(true)
const viewedPlan = ref(null)
const modalOpen = ref(false)
const selectedPlan = ref(null)
const deleteTarget = ref(null)

const columns = [
  { key: 'user_name', label: 'Pengguna' },
  { key: 'travel_date', label: 'Tanggal Perjalanan', formatter: formatDate },
  { key: 'duration', label: 'Durasi' },
  { key: 'destination_count', label: 'Jumlah Destinasi' },
  { key: 'status', label: 'Status' },
]

const fields = [
  { key: 'user_name', label: 'Nama Pengguna', required: true },
  { key: 'travel_date', label: 'Tanggal Perjalanan', type: 'date', required: true },
  { key: 'duration', label: 'Durasi Hari', type: 'number', default: 1, required: true },
  { key: 'destination_count', label: 'Jumlah Destinasi', type: 'number', default: 1, required: true },
  {
    key: 'status',
    label: 'Status',
    type: 'select',
    options: [
      { label: 'Planned', value: 'planned' },
      { label: 'Draft', value: 'draft' },
      { label: 'Completed', value: 'completed' },
    ],
    default: 'planned',
    required: true,
  },
  { key: 'itinerary', label: 'Itinerary', type: 'textarea', full: true },
]

function formatDate(value) {
  if (!value) return '-'
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value))
}

async function loadTripPlans() {
  isLoading.value = true
  const data = await getAdminCollection('tripPlans')
  tripPlans.value = data.map(normalizePlan)
  isLoading.value = false
}

function normalizePlan(plan) {
  return {
    ...plan,
    duration: Number(plan.duration || 0),
    destination_count: Number(plan.destination_count || 0),
  }
}

function openCreateModal() {
  selectedPlan.value = null
  modalOpen.value = true
}

function openEditModal(plan) {
  selectedPlan.value = { ...plan }
  modalOpen.value = true
}

async function handleSubmit(payload) {
  const record = normalizePlan(payload)

  if (selectedPlan.value?.id) {
    const updated = await updateAdminRecord('tripPlans', selectedPlan.value.id, record)
    tripPlans.value = tripPlans.value.map((plan) => (
      plan.id === selectedPlan.value.id ? normalizePlan(updated) : plan
    ))
  } else {
    const created = await createAdminRecord('tripPlans', record)
    tripPlans.value = [normalizePlan(created), ...tripPlans.value]
  }

  modalOpen.value = false
}

async function confirmDelete() {
  await deleteAdminRecord('tripPlans', deleteTarget.value.id)
  tripPlans.value = tripPlans.value.filter((plan) => plan.id !== deleteTarget.value.id)
  deleteTarget.value = null
}

onMounted(loadTripPlans)
</script>

<template>
  <div class="space-y-5">
    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 class="text-xl font-bold text-deep-charcoal">Trip Planner Management</h2>
        <p class="mt-1 text-sm font-medium text-muted-gray">Pantau rencana perjalanan yang dibuat pengguna.</p>
      </div>
      <button class="inline-flex items-center justify-center gap-2 rounded-lg bg-nature-green px-4 py-2.5 text-sm font-bold text-white transition hover:bg-deep-charcoal" type="button" @click="openCreateModal">
        <Plus class="size-4" />
        Tambah Trip
      </button>
    </div>

    <div v-if="isLoading" class="rounded-lg border border-black/10 bg-white p-6 text-sm font-semibold text-muted-gray">
      Memuat trip planner...
    </div>

    <DataTable v-else :columns="columns" :items="tripPlans">
      <template #cell-duration="{ value }">
        <span>{{ value }} hari</span>
      </template>
      <template #cell-status="{ value }">
        <span class="rounded-lg bg-soft-cream px-2.5 py-1 text-xs font-bold uppercase text-nature-green">{{ value }}</span>
      </template>
      <template #actions="{ item }">
        <div class="inline-flex items-center gap-2">
          <button class="grid size-9 place-items-center rounded-lg border border-black/10 text-muted-gray transition hover:border-soft-gold hover:text-nature-green" type="button" aria-label="Lihat itinerary" @click="viewedPlan = item">
            <Eye class="size-4" />
          </button>
          <button class="grid size-9 place-items-center rounded-lg border border-black/10 text-muted-gray transition hover:border-soft-gold hover:text-nature-green" type="button" aria-label="Edit trip planner" @click="openEditModal(item)">
            <Edit3 class="size-4" />
          </button>
          <button class="grid size-9 place-items-center rounded-lg border border-black/10 text-muted-gray transition hover:border-red-200 hover:bg-red-50 hover:text-red-600" type="button" aria-label="Hapus trip planner" @click="deleteTarget = item">
            <Trash2 class="size-4" />
          </button>
        </div>
      </template>
    </DataTable>

    <ModalForm
      :open="modalOpen"
      :title="selectedPlan ? 'Edit Trip Planner' : 'Tambah Trip Planner'"
      :fields="fields"
      :model-value="selectedPlan || {}"
      submit-label="Simpan Trip"
      @close="modalOpen = false"
      @submit="handleSubmit"
    />

    <Teleport to="body">
      <div v-if="viewedPlan" class="fixed inset-0 z-50 grid place-items-center bg-deep-charcoal/35 px-4">
        <section class="w-full max-w-xl rounded-lg bg-white p-5 shadow-2xl">
          <p class="text-xs font-bold uppercase tracking-[0.18em] text-soft-gold">Itinerary</p>
          <h2 class="mt-2 text-lg font-bold text-deep-charcoal">{{ viewedPlan.user_name }}</h2>
          <p class="mt-4 rounded-lg bg-soft-cream p-4 text-sm leading-7 text-muted-gray">
            {{ viewedPlan.itinerary || 'Belum ada detail itinerary.' }}
          </p>
          <div class="mt-6 flex justify-end">
            <button class="rounded-lg bg-nature-green px-4 py-2 text-sm font-bold text-white" type="button" @click="viewedPlan = null">
              Tutup
            </button>
          </div>
        </section>
      </div>
    </Teleport>

    <ConfirmDelete
      :open="Boolean(deleteTarget)"
      title="Hapus trip planner?"
      :message="`Rencana perjalanan ${deleteTarget?.user_name || ''} akan dihapus.`"
      @cancel="deleteTarget = null"
      @confirm="confirmDelete"
    />
  </div>
</template>
