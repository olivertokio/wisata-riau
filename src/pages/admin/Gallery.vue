<script setup>
import { Edit3, ImagePlus, Trash2, Upload } from 'lucide-vue-next'
import { computed, onMounted, reactive, ref } from 'vue'
import ConfirmDelete from '../../components/admin/ConfirmDelete.vue'
import ModalForm from '../../components/admin/ModalForm.vue'
import {
  createAdminRecord,
  deleteAdminRecord,
  getAdminCollection,
  updateAdminRecord,
  uploadGalleryImage,
} from '../../services/adminService'

const gallery = ref([])
const destinations = ref([])
const isLoading = ref(true)
const isUploading = ref(false)
const modalOpen = ref(false)
const selectedImage = ref(null)
const deleteTarget = ref(null)
const uploadForm = reactive({
  file: null,
  caption: '',
  destination_id: '',
})

const selectedFileName = computed(() => uploadForm.file?.name || 'Pilih gambar')
const destinationOptions = computed(() => destinations.value.map((destination) => ({
  label: destination.name,
  value: destination.id,
})))
const fields = computed(() => [
  { key: 'caption', label: 'Caption', required: true },
  { key: 'destination_id', label: 'Destinasi', type: 'select', options: destinationOptions.value, required: true },
  { key: 'image_url', label: 'Image URL', type: 'url', full: true, required: true },
])

function destinationNameFor(destinationId) {
  return destinations.value.find((destination) => String(destination.id) === String(destinationId))?.name || 'Belum di-assign'
}

function handleFileChange(event) {
  uploadForm.file = event.target.files?.[0] || null
}

async function loadGallery() {
  isLoading.value = true
  const [galleryData, destinationData] = await Promise.all([
    getAdminCollection('gallery'),
    getAdminCollection('destinations'),
  ])
  destinations.value = destinationData
  gallery.value = galleryData.map(normalizeImage)
  isLoading.value = false
}

function normalizeImage(image) {
  return {
    ...image,
    destination_name: image.destination_name || destinationNameFor(image.destination_id),
  }
}

function openEditModal(image) {
  selectedImage.value = { ...normalizeImage(image) }
  modalOpen.value = true
}

async function handleUpload() {
  if (!uploadForm.file) return

  isUploading.value = true
  const uploaded = await uploadGalleryImage(uploadForm.file)
  const payload = {
    ...uploaded,
    caption: uploadForm.caption,
    destination_id: uploadForm.destination_id,
    destination_name: destinationNameFor(uploadForm.destination_id),
  }
  const created = await createAdminRecord('gallery', payload)
  gallery.value = [normalizeImage(created), ...gallery.value]
  uploadForm.file = null
  uploadForm.caption = ''
  uploadForm.destination_id = ''
  isUploading.value = false
}

async function handleSubmit(payload) {
  const record = normalizeImage({
    ...payload,
    destination_name: destinationNameFor(payload.destination_id),
  })
  const updated = await updateAdminRecord('gallery', selectedImage.value.id, record)
  gallery.value = gallery.value.map((image) => (
    image.id === selectedImage.value.id ? normalizeImage(updated) : image
  ))
  modalOpen.value = false
}

async function confirmDelete() {
  await deleteAdminRecord('gallery', deleteTarget.value.id)
  gallery.value = gallery.value.filter((image) => image.id !== deleteTarget.value.id)
  deleteTarget.value = null
}

onMounted(loadGallery)
</script>

<template>
  <div class="space-y-5">
    <div>
      <h2 class="text-xl font-bold text-deep-charcoal">Gallery Management</h2>
      <p class="mt-1 text-sm font-medium text-muted-gray">Upload, preview, dan assign gambar wisata.</p>
    </div>

    <form class="grid gap-4 rounded-lg border border-black/10 bg-white p-5 lg:grid-cols-[1fr_1fr_1fr_auto]" @submit.prevent="handleUpload">
      <label class="block">
        <span class="mb-2 block text-sm font-bold text-deep-charcoal">Gambar</span>
        <span class="flex h-11 cursor-pointer items-center gap-3 rounded-lg border border-black/10 bg-soft-cream px-3 text-sm font-semibold text-muted-gray">
          <ImagePlus class="size-4 shrink-0 text-nature-green" />
          <span class="truncate">{{ selectedFileName }}</span>
          <input class="sr-only" type="file" accept="image/*" @change="handleFileChange" />
        </span>
      </label>

      <label class="block">
        <span class="mb-2 block text-sm font-bold text-deep-charcoal">Caption</span>
        <input v-model="uploadForm.caption" class="h-11 w-full rounded-lg border border-black/10 bg-soft-cream px-3 text-sm outline-none focus:border-soft-gold focus:bg-white" type="text" />
      </label>

      <label class="block">
        <span class="mb-2 block text-sm font-bold text-deep-charcoal">Destinasi</span>
        <select v-model="uploadForm.destination_id" class="h-11 w-full rounded-lg border border-black/10 bg-soft-cream px-3 text-sm outline-none focus:border-soft-gold focus:bg-white">
          <option value="">Belum di-assign</option>
          <option v-for="destination in destinations" :key="destination.id" :value="destination.id">{{ destination.name }}</option>
        </select>
      </label>

      <div class="flex items-end">
        <button class="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-nature-green px-4 text-sm font-bold text-white transition hover:bg-deep-charcoal disabled:cursor-not-allowed disabled:opacity-60 lg:w-auto" type="submit" :disabled="!uploadForm.file || isUploading">
          <Upload class="size-4" />
          {{ isUploading ? 'Uploading' : 'Upload' }}
        </button>
      </div>
    </form>

    <div v-if="isLoading" class="rounded-lg border border-black/10 bg-white p-6 text-sm font-semibold text-muted-gray">
      Memuat galeri...
    </div>

    <div v-else class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      <article v-for="image in gallery" :key="image.id" class="overflow-hidden rounded-lg border border-black/10 bg-white shadow-sm">
        <img class="h-52 w-full object-cover" :src="image.image_url || image.image" :alt="image.caption || image.destination_name" />
        <div class="p-4">
          <div class="flex items-start justify-between gap-3">
            <div class="min-w-0">
              <h3 class="truncate text-sm font-bold text-deep-charcoal">{{ image.caption || 'Gambar wisata' }}</h3>
              <p class="mt-1 truncate text-xs font-semibold text-muted-gray">{{ image.destination_name || destinationNameFor(image.destination_id) }}</p>
            </div>
            <div class="inline-flex shrink-0 items-center gap-2">
              <button class="grid size-9 place-items-center rounded-lg border border-black/10 text-muted-gray transition hover:border-soft-gold hover:text-nature-green" type="button" aria-label="Edit gambar" @click="openEditModal(image)">
                <Edit3 class="size-4" />
              </button>
              <button class="grid size-9 place-items-center rounded-lg border border-black/10 text-muted-gray transition hover:border-red-200 hover:bg-red-50 hover:text-red-600" type="button" aria-label="Hapus gambar" @click="deleteTarget = image">
                <Trash2 class="size-4" />
              </button>
            </div>
          </div>
        </div>
      </article>
    </div>

    <ModalForm
      :open="modalOpen"
      title="Edit Gambar"
      :fields="fields"
      :model-value="selectedImage || {}"
      submit-label="Simpan Gambar"
      @close="modalOpen = false"
      @submit="handleSubmit"
    />

    <ConfirmDelete
      :open="Boolean(deleteTarget)"
      title="Hapus gambar?"
      :message="`Gambar ${deleteTarget?.caption || ''} akan dihapus dari galeri.`"
      @cancel="deleteTarget = null"
      @confirm="confirmDelete"
    />
  </div>
</template>
