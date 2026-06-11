import { requireSupabase, supabase } from './supabase'

function normalizeProfile(profile, authUser = null) {
  if (!profile && !authUser) return null

  const metadata = authUser?.user_metadata || {}
  const email = profile?.email || authUser?.email || ''
  const fullName = profile?.full_name || metadata.full_name || metadata.name || email.split('@')[0] || 'Pengguna'

  return {
    id: profile?.id || authUser?.id,
    email,
    full_name: fullName,
    name: fullName,
    avatar_url: profile?.avatar_url || metadata.avatar_url || '',
    role: profile?.role || metadata.role || 'user',
    created_at: profile?.created_at || authUser?.created_at || '',
  }
}

async function getProfile(user) {
  if (!user) return null

  const client = requireSupabase()
  const { data, error } = await client
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle()

  if (error) throw error

  if (data) {
    return normalizeProfile(data, user)
  }

  const fallbackProfile = {
    id: user.id,
    email: user.email,
    full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Pengguna',
    avatar_url: '',
    role: user.user_metadata?.role || 'user',
  }

  const { data: insertedProfile, error: insertError } = await client
    .from('profiles')
    .insert([fallbackProfile])
    .select()
    .single()

  if (insertError) {
    return normalizeProfile(null, user)
  }

  return normalizeProfile(insertedProfile, user)
}

export async function registerUser({ fullName, email, password }) {
  const client = requireSupabase()

  const { data, error } = await client.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        role: 'user',
      },
    },
  })

  if (error) throw error

  if (data.user) {
    const profilePayload = {
      id: data.user.id,
      email: data.user.email,
      full_name: fullName,
      avatar_url: '',
      role: 'user',
    }

    await client
      .from('profiles')
      .upsert(profilePayload, { onConflict: 'id' })
  }

  return getCurrentUser()
}

export async function loginUser({ email, password }) {
  const client = requireSupabase()

  const { error } = await client.auth.signInWithPassword({
    email,
    password,
  })

  if (error) throw error
  return getCurrentUser()
}

export async function logoutUser() {
  const client = requireSupabase()
  const { error } = await client.auth.signOut()
  if (error) throw error
}

export async function getCurrentUser() {
  const client = requireSupabase()
  const { data, error } = await client.auth.getSession()
  if (error) throw error

  const user = data.session?.user || null
  return getProfile(user)
}

export async function isAuthenticated() {
  return Boolean(await getCurrentUser())
}

export function onAuthStateChange(callback) {
  if (!supabase) {
    return { data: { subscription: { unsubscribe() {} } } }
  }

  return supabase.auth.onAuthStateChange(async (_event, session) => {
    try {
      const profile = await getProfile(session?.user || null)
      callback(profile)
    } catch {
      callback(normalizeProfile(null, session?.user || null))
    }
  })
}
