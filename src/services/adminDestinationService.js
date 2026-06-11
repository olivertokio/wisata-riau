import { requireSupabase } from './supabase'

const tableName = 'destinations'

function normalizeNumber(value, fallback = 0) {
  if (value === '' || value === null || value === undefined) {
    return fallback
  }

  return Number(value)
}

function sanitizeDestination(payload) {
  return {
    name: payload.name?.trim() || '',
    slug: payload.slug?.trim() || '',
    category_id: normalizeNumber(payload.category_id, null),
    location: payload.location?.trim() || '',
    description: payload.description?.trim() || '',
    image: payload.image?.trim() || '',
    latitude: normalizeNumber(payload.latitude, null),
    longitude: normalizeNumber(payload.longitude, null),
    rating: normalizeNumber(payload.rating),
    views: normalizeNumber(payload.views),
  }
}

export async function fetchAdminDestinations() {
  const supabase = requireSupabase()

  const { data, error } = await supabase
    .from(tableName)
    .select('*')
    .order('id', { ascending: false })

  if (error) throw error
  return data || []
}

export async function createAdminDestination(payload) {
  const supabase = requireSupabase()

  const { data, error } = await supabase
    .from(tableName)
    .insert([sanitizeDestination(payload)])
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateAdminDestination(id, payload) {
  const supabase = requireSupabase()

  const { data, error } = await supabase
    .from(tableName)
    .update(sanitizeDestination(payload))
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteAdminDestination(id) {
  const supabase = requireSupabase()

  const { error } = await supabase
    .from(tableName)
    .delete()
    .eq('id', id)

  if (error) throw error
  return true
}
