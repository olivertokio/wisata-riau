import { requireSupabase } from './supabase'

export async function getFavoriteIdsByUser(userId) {
  const supabase = requireSupabase()

  const { data, error } = await supabase
    .from('favorites')
    .select('destination_id')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return (data || []).map((item) => item.destination_id)
}

export async function addFavorite(userId, destinationId) {
  const supabase = requireSupabase()
  const numericDestinationId = Number(destinationId)

  const existing = await supabase
    .from('favorites')
    .select('*')
    .eq('user_id', userId)
    .eq('destination_id', numericDestinationId)
    .maybeSingle()

  if (existing.error) throw existing.error
  if (existing.data) return existing.data

  const { data, error } = await supabase
    .from('favorites')
    .insert([{
      user_id: userId,
      destination_id: numericDestinationId,
    }])
    .select()
    .single()

  if (error) throw error
  return data
}

export async function removeFavorite(userId, destinationId) {
  const supabase = requireSupabase()

  const { error } = await supabase
    .from('favorites')
    .delete()
    .eq('user_id', userId)
    .eq('destination_id', Number(destinationId))

  if (error) throw error
  return true
}

export async function toggleFavorite(userId, destinationId, isFavorite) {
  if (isFavorite) {
    await removeFavorite(userId, destinationId)
    return false
  }

  await addFavorite(userId, destinationId)
  return true
}
