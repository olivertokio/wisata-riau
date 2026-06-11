import { supabase } from '@/supabase'

const tableMap = {
  destinations: 'destinations',
  categories: 'categories',
  reviews: 'reviews',
  users: 'profiles',
  tripPlans: 'trip_plans',
  gallery: 'destination_images',
}

function normalizeResource(resource) {
  if (!tableMap[resource]) {
    throw new Error(`Resource admin tidak dikenal: ${resource}`)
  }

  return tableMap[resource]
}

export async function getAdminDashboardData() {
  const [destinations, categories, reviews, users, tripPlans] = await Promise.all([
    getAdminCollection('destinations'),
    getAdminCollection('categories'),
    getAdminCollection('reviews'),
    getAdminCollection('users'),
    getAdminCollection('tripPlans'),
  ])

  return {
    stats: {
      destinations: destinations.length,
      categories: categories.length,
      reviews: reviews.length,
      users: users.length,
      tripPlans: tripPlans.length,
    },
    recentDestinations: destinations.slice(0, 5),
    recentReviews: reviews.slice(0, 5),
    activity: [
      { id: 1, label: 'Dashboard admin aktif', time: 'Hari ini', tone: 'success' },
      { id: 2, label: 'Data Supabase berhasil dimuat', time: 'Baru saja', tone: 'info' },
    ],
    destinationByCategory: categories.map((category) => ({
      name: category.name,
      total: destinations.filter(
        (destination) => String(destination.category_id) === String(category.id)
      ).length,
    })),
  }
}

export async function getAdminCollection(resource) {
  const table = normalizeResource(resource)

  const { data, error } = await supabase
    .from(table)
    .select('*')
    .order('id', { ascending: false })

  if (error) throw error
  return data || []
}

export async function createAdminRecord(resource, payload) {
  const table = normalizeResource(resource)

  const { data, error } = await supabase
    .from(table)
    .insert([payload])
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateAdminRecord(resource, id, payload) {
  const table = normalizeResource(resource)

  const { data, error } = await supabase
    .from(table)
    .update(payload)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteAdminRecord(resource, id) {
  const table = normalizeResource(resource)

  const { error } = await supabase
    .from(table)
    .delete()
    .eq('id', id)

  if (error) throw error
  return true
}

export async function uploadGalleryImage(file) {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET

  if (!cloudName || !uploadPreset) {
    throw new Error('Cloudinary belum dikonfigurasi. Isi VITE_CLOUDINARY_CLOUD_NAME dan VITE_CLOUDINARY_UPLOAD_PRESET di file .env.')
  }

  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', uploadPreset)

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    {
      method: 'POST',
      body: formData,
    }
  )

  if (!response.ok) {
    throw new Error('Upload gambar ke Cloudinary gagal.')
  }

  const data = await response.json()

  return {
    image_url: data.secure_url,
    public_id: data.public_id,
  }
}