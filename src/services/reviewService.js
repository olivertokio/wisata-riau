import { supabase } from '@/supabase'

export async function getReviews() {
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function getReviewsByDestination(destinationId) {
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('destination_id', Number(destinationId))
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function addReview(payload) {
  const { data, error } = await supabase
    .from('reviews')
    .insert([{ ...payload, created_at: new Date().toISOString() }])
    .select()
    .single()
  if (error) throw error
  return data
}
