import { supabase } from '@/supabase'

function normalizeDestinationImage(image) {
  if (!image) {
    return null
  }

  const imageUrl = image.image_url || image.image || image.url || image.src

  if (!imageUrl) {
    return null
  }

  return {
    ...image,
    image_url: imageUrl,
    caption: image.caption || image.title || image.name || '',
    order: image.order ?? image.sort_order ?? image.position ?? 0,
  }
}

function normalizeDestination(destination) {
  if (!destination) {
    return destination
  }

  const destinationImages = Array.isArray(destination.destination_images)
    ? destination.destination_images
      .map(normalizeDestinationImage)
      .filter(Boolean)
      .sort((left, right) => Number(left.order || 0) - Number(right.order || 0))
    : destination.destination_images

  return {
    ...destination,
    image: destination.image || destination.image_url,
    reviewCount: destination.reviewCount ?? destination.review_count ?? 0,
    destination_images: destinationImages,
  }
}

// ─── DESTINATIONS ────────────────────────────────────────────────────────────

// Ambil semua destinasi
export async function getDestinations() {
  const { data, error } = await supabase
    .from('destinations')
    .select('*')
    .order('id')
  if (error) throw error
  return (data || []).map(normalizeDestination)
}

// Ambil 1 destinasi berdasarkan ID
export async function getDestination(id) {
  const { data, error } = await supabase
    .from('destinations')
    .select('*')
    .eq('id', Number(id))
    .maybeSingle()
  if (error) throw error
  return normalizeDestination(data) || null
}

// Ambil destinasi berdasarkan kategori
export async function getDestinationsByCategory(category) {
  const { data, error } = await supabase
    .from('destinations')
    .select('*')
    .eq('category', category)
    .order('rating', { ascending: false })
  if (error) throw error
  return (data || []).map(normalizeDestination)
}

// ─── GALLERY ─────────────────────────────────────────────────────────────────

// Ambil semua foto gallery milik 1 destinasi
export async function getDestinationImages(destinationId) {
  const { data, error } = await supabase
    .from('destination_images')
    .select('*')
    .eq('destination_id', Number(destinationId))
  if (error) throw error
  return (data || [])
    .map(normalizeDestinationImage)
    .filter(Boolean)
    .sort((left, right) => Number(left.order || 0) - Number(right.order || 0))
}

// Ambil destinasi BESERTA gallery-nya sekaligus
export async function getDestinationWithImages(id) {
  const [destination, destinationImages] = await Promise.all([
    getDestination(id),
    getDestinationImages(id),
  ])

  return destination
    ? {
        ...destination,
        destination_images: destinationImages,
      }
    : null
}

// ─── REVIEWS ─────────────────────────────────────────────────────────────────

// Ambil semua ulasan milik 1 destinasi
export async function getReviews(destinationId) {
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('destination_id', destinationId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

// Tambah ulasan baru
export async function addReview(review) {
  const { data, error } = await supabase
    .from('reviews')
    .insert([{ ...review, created_at: new Date().toISOString() }])
    .select()
  if (error) throw error
  return data
}
