import { requireSupabase } from './supabase'

function missingColumnFrom(error) {
  return error?.message?.match(/'([^']+)' column/)?.[1] || null
}

async function insertTripPlanWithSchemaRetry(supabase, payload) {
  let currentPayload = { ...payload }
  let lastError = null

  for (let attempt = 0; attempt < 8; attempt += 1) {
    const { data, error } = await supabase
      .from('trip_plans')
      .insert([currentPayload])
      .select()
      .single()

    if (!error) {
      return data
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

export async function createUserTripPlan(userId, preferences) {
  const supabase = requireSupabase()

  const payload = {
    user_id: userId,
    trip_type: preferences.tripType,
    duration: Number(preferences.duration),
    start_date: preferences.startDate || null,
    category: preferences.category,
    accommodation: preferences.includeStay ? preferences.budget : 'Tanpa penginapan',
    created_at: new Date().toISOString(),
  }

  return insertTripPlanWithSchemaRetry(supabase, payload)
}

export async function getTripPlansByUser(userId) {
  const supabase = requireSupabase()

  const { data, error } = await supabase
    .from('trip_plans')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}
