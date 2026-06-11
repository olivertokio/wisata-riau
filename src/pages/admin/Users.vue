<script setup>
import { Edit3, Eye, Plus, Trash2, UserX } from 'lucide-vue-next'
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

const users = ref([])
const isLoading = ref(true)
const viewedUser = ref(null)
const modalOpen = ref(false)
const selectedUser = ref(null)
const deleteTarget = ref(null)

const columns = [
  { key: 'name', label: 'Nama' },
  { key: 'email', label: 'Email' },
  { key: 'role', label: 'Role' },
  { key: 'created_at', label: 'Join Date', formatter: formatDate },
  { key: 'status', label: 'Status' },
]

const fields = [
  { key: 'name', label: 'Nama', required: true },
  { key: 'email', label: 'Email', type: 'email', required: true },
  {
    key: 'role',
    label: 'Role',
    type: 'select',
    options: [
      { label: 'Admin', value: 'admin' },
      { label: 'User', value: 'user' },
    ],
    default: 'user',
    required: true,
  },
  {
    key: 'status',
    label: 'Status',
    type: 'select',
    options: [
      { label: 'Active', value: 'active' },
      { label: 'Suspended', value: 'suspended' },
    ],
    default: 'active',
    required: true,
  },
]

function formatDate(value) {
  if (!value) return '-'
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value))
}

function normalizeUser(user) {
  return {
    ...user,
    name: user.name || user.full_name || user.email || 'Pengguna',
    role: user.role || 'user',
    status: user.status || 'active',
    created_at: user.created_at || user.joined_at,
  }
}

async function loadUsers() {
  isLoading.value = true
  const data = await getAdminCollection('users')
  users.value = data.map(normalizeUser)
  isLoading.value = false
}

function openCreateModal() {
  selectedUser.value = null
  modalOpen.value = true
}

function openEditModal(user) {
  selectedUser.value = { ...user }
  modalOpen.value = true
}

async function handleSubmit(payload) {
  const record = normalizeUser(payload)

  if (selectedUser.value?.id) {
    const updated = await updateAdminRecord('users', selectedUser.value.id, record)
    users.value = users.value.map((user) => (
      user.id === selectedUser.value.id ? normalizeUser(updated) : user
    ))
  } else {
    const created = await createAdminRecord('users', record)
    users.value = [normalizeUser(created), ...users.value]
  }

  modalOpen.value = false
}

async function toggleSuspend(user) {
  const nextStatus = user.status === 'suspended' ? 'active' : 'suspended'
  const updated = await updateAdminRecord('users', user.id, { ...user, status: nextStatus })
  users.value = users.value.map((item) => (item.id === user.id ? normalizeUser(updated) : item))
}

async function confirmDelete() {
  await deleteAdminRecord('users', deleteTarget.value.id)
  users.value = users.value.filter((user) => user.id !== deleteTarget.value.id)
  deleteTarget.value = null
}

onMounted(loadUsers)
</script>

<template>
  <div class="space-y-5">
    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 class="text-xl font-bold text-deep-charcoal">Users Management</h2>
        <p class="mt-1 text-sm font-medium text-muted-gray">Pantau akun pengguna dan role akses.</p>
      </div>
      <button class="inline-flex items-center justify-center gap-2 rounded-lg bg-nature-green px-4 py-2.5 text-sm font-bold text-white transition hover:bg-deep-charcoal" type="button" @click="openCreateModal">
        <Plus class="size-4" />
        Tambah User
      </button>
    </div>

    <div v-if="isLoading" class="rounded-lg border border-black/10 bg-white p-6 text-sm font-semibold text-muted-gray">
      Memuat pengguna...
    </div>

    <DataTable v-else :columns="columns" :items="users">
      <template #cell-role="{ value }">
        <span class="rounded-lg bg-soft-cream px-2.5 py-1 text-xs font-bold uppercase text-nature-green">{{ value }}</span>
      </template>
      <template #cell-status="{ value }">
        <span
          class="rounded-lg px-2.5 py-1 text-xs font-bold uppercase"
          :class="value === 'suspended' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-nature-green'"
        >
          {{ value }}
        </span>
      </template>
      <template #actions="{ item }">
        <div class="inline-flex items-center gap-2">
          <button class="grid size-9 place-items-center rounded-lg border border-black/10 text-muted-gray transition hover:border-soft-gold hover:text-nature-green" type="button" aria-label="Lihat pengguna" @click="viewedUser = item">
            <Eye class="size-4" />
          </button>
          <button class="grid size-9 place-items-center rounded-lg border border-black/10 text-muted-gray transition hover:border-soft-gold hover:text-nature-green" type="button" aria-label="Edit pengguna" @click="openEditModal(item)">
            <Edit3 class="size-4" />
          </button>
          <button class="grid size-9 place-items-center rounded-lg border border-black/10 text-muted-gray transition hover:border-soft-gold hover:text-soft-gold" type="button" aria-label="Suspend pengguna" @click="toggleSuspend(item)">
            <UserX class="size-4" />
          </button>
          <button class="grid size-9 place-items-center rounded-lg border border-black/10 text-muted-gray transition hover:border-red-200 hover:bg-red-50 hover:text-red-600" type="button" aria-label="Hapus pengguna" @click="deleteTarget = item">
            <Trash2 class="size-4" />
          </button>
        </div>
      </template>
    </DataTable>

    <ModalForm
      :open="modalOpen"
      :title="selectedUser ? 'Edit User' : 'Tambah User'"
      :fields="fields"
      :model-value="selectedUser || {}"
      submit-label="Simpan User"
      @close="modalOpen = false"
      @submit="handleSubmit"
    />

    <Teleport to="body">
      <div v-if="viewedUser" class="fixed inset-0 z-50 grid place-items-center bg-deep-charcoal/35 px-4">
        <section class="w-full max-w-lg rounded-lg bg-white p-5 shadow-2xl">
          <h2 class="text-lg font-bold text-deep-charcoal">{{ viewedUser.name }}</h2>
          <dl class="mt-5 grid gap-3 text-sm">
            <div class="flex justify-between gap-4 border-b border-black/10 pb-3">
              <dt class="font-bold text-muted-gray">Email</dt>
              <dd class="text-right font-semibold text-deep-charcoal">{{ viewedUser.email }}</dd>
            </div>
            <div class="flex justify-between gap-4 border-b border-black/10 pb-3">
              <dt class="font-bold text-muted-gray">Role</dt>
              <dd class="font-semibold text-deep-charcoal">{{ viewedUser.role }}</dd>
            </div>
            <div class="flex justify-between gap-4">
              <dt class="font-bold text-muted-gray">Status</dt>
              <dd class="font-semibold text-deep-charcoal">{{ viewedUser.status }}</dd>
            </div>
          </dl>
          <div class="mt-6 flex justify-end">
            <button class="rounded-lg bg-nature-green px-4 py-2 text-sm font-bold text-white" type="button" @click="viewedUser = null">
              Tutup
            </button>
          </div>
        </section>
      </div>
    </Teleport>

    <ConfirmDelete
      :open="Boolean(deleteTarget)"
      title="Hapus pengguna?"
      :message="`Akun ${deleteTarget?.name || ''} akan dihapus dari daftar pengguna.`"
      @cancel="deleteTarget = null"
      @confirm="confirmDelete"
    />
  </div>
</template>
