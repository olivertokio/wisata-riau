import { requireSupabase } from '@/supabase'

function normalizeReview(review) {
  const profile = Array.isArray(review.profiles) ? review.profiles[0] : review.profiles

  return {
    ...review,
    name: profile?.full_name || review.name || review.user_name || 'Pengguna RiauScape',
  }
}

function missingColumnFrom(error) {
  return error?.message?.match(/'([^']+)' column/)?.[1] || null
}

async function insertReviewWithSchemaRetry(supabase, payload) {
  let currentPayload = { ...payload }
  let lastError = null

  for (let attempt = 0; attempt < 6; attempt += 1) {
    const { data, error } = await supabase
      .from('reviews')
      .insert([{ ...currentPayload, created_at: new Date().toISOString() }])
      .select('*')
      .single()

    if (!error) {
      return normalizeReview(data)
    }

    lastError = error
    const missingColumn = missingColumnFrom(error)

    if (!missingColumn || !(missingColumn in currentPayload)) {
      throw error
    }

    const { [missingColumn]: _removed, ...nextPayload } = currentPayload
    currentPayload = nextPayload
  }

  throw lastError
}

export async function getReviews() {
  const supabase = requireSupabase()
  const { data, error } = await supabase
    .from('reviews')
    .select('*, profiles(full_name, avatar_url)')
    .order('created_at', { ascending: false })
  if (error) {
    const fallback = await supabase
      .from('reviews')
      .select('*')
      .order('created_at', { ascending: false })
    if (fallback.error) throw fallback.error
    return (fallback.data || []).map(normalizeReview)
  }
  return (data || []).map(normalizeReview)
}

export async function getReviewsByDestination(destinationId) {
  const supabase = requireSupabase()
  const { data, error } = await supabase
    .from('reviews')
    .select('*, profiles(full_name, avatar_url)')
    .eq('destination_id', Number(destinationId))
    .order('created_at', { ascending: false })
  if (error) {
    const fallback = await supabase
      .from('reviews')
      .select('*')
      .eq('destination_id', Number(destinationId))
      .order('created_at', { ascending: false })
    if (fallback.error) throw fallback.error
    return (fallback.data || []).map(normalizeReview)
  }
  return (data || []).map(normalizeReview)
}

export async function addReview(payload) {
  const supabase = requireSupabase()
  return insertReviewWithSchemaRetry(supabase, payload)
}
