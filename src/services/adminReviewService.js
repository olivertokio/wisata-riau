import { requireSupabase } from './supabase'

const TABLE_NAME = 'reviews'

export async function getAdminReviews() {
  const supabase = requireSupabase()

  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select(`
      id,
      destination_id,
      name,
      rating,
      comment,
      created_at
    `)
    .order('created_at', { ascending: false })

  if (error) throw error

  return data || []
}

export async function createAdminReview(payload) {
  const supabase = requireSupabase()

  const reviewData = {
    destination_id: payload.destination_id,
    name: payload.name,
    rating: Number(payload.rating),
    comment: payload.comment,
    created_at: payload.created_at || new Date().toISOString(),
  }

  const { data, error } = await supabase
    .from(TABLE_NAME)
    .insert([reviewData])
    .select()
    .single()

  if (error) throw error

  return data
}

export async function updateAdminReview(id, payload) {
  const supabase = requireSupabase()

  const reviewData = {
    destination_id: payload.destination_id,
    name: payload.name,
    rating: Number(payload.rating),
    comment: payload.comment,
  }

  const { data, error } = await supabase
    .from(TABLE_NAME)
    .update(reviewData)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error

  return data
}

export async function deleteAdminReview(id) {
  const supabase = requireSupabase()

  const { data, error } = await supabase
    .from('reviews')
    .delete()
    .eq('id', id)
    .select()

  console.log('DELETE RESULT:', { data, error })

  if (error) throw error

  return data
}