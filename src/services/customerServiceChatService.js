import { requireSupabase } from './supabase'

const conversationColumns = 'id, visitor_name, visitor_email, user_id, status, created_at, updated_at'
const messageColumns = 'id, conversation_id, sender_type, message, is_read, created_at'

export async function createConversation({ visitorName, visitorEmail, userId = null }) {
  const supabase = requireSupabase()

  const { data, error } = await supabase
    .from('customer_conversations')
    .insert([{
      visitor_name: visitorName,
      visitor_email: visitorEmail,
      user_id: userId,
      status: 'open',
      updated_at: new Date().toISOString(),
    }])
    .select(conversationColumns)
    .single()

  if (error) throw error
  return data
}

export async function getConversation(id) {
  const supabase = requireSupabase()

  const { data, error } = await supabase
    .from('customer_conversations')
    .select(conversationColumns)
    .eq('id', id)
    .maybeSingle()

  if (error) throw error
  return data
}

export async function getUserOpenConversation(userId) {
  const supabase = requireSupabase()

  const { data, error } = await supabase
    .from('customer_conversations')
    .select(conversationColumns)
    .eq('user_id', userId)
    .neq('status', 'closed')
    .order('updated_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error) throw error
  return data
}

export async function getConversationMessages(conversationId) {
  const supabase = requireSupabase()

  const { data, error } = await supabase
    .from('customer_messages')
    .select(messageColumns)
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true })

  if (error) throw error
  return data || []
}

export async function sendMessage({ conversationId, senderType, message }) {
  const supabase = requireSupabase()

  const { data, error } = await supabase
    .from('customer_messages')
    .insert([{
      conversation_id: conversationId,
      sender_type: senderType,
      message,
      is_read: senderType === 'admin',
    }])
    .select(messageColumns)
    .single()

  if (error) throw error

  await supabase
    .from('customer_conversations')
    .update({
      status: senderType === 'admin' ? 'waiting' : 'open',
      updated_at: new Date().toISOString(),
    })
    .eq('id', conversationId)

  return data
}

export async function getAdminConversations() {
  const supabase = requireSupabase()

  const { data, error } = await supabase
    .from('customer_conversations')
    .select(conversationColumns)
    .order('updated_at', { ascending: false })

  if (error) throw error

  const conversations = data || []
  const hydrated = await Promise.all(conversations.map(async (conversation) => {
    const messages = await getConversationMessages(conversation.id)
    const lastMessage = messages[messages.length - 1] || null
    const unreadCount = messages.filter((message) => message.sender_type === 'user' && !message.is_read).length

    return {
      ...conversation,
      last_message: lastMessage?.message || '',
      unread_count: unreadCount,
      messages,
    }
  }))

  return hydrated
}

export async function markConversationMessagesRead(conversationId, senderType = 'user') {
  const supabase = requireSupabase()

  const { error } = await supabase
    .from('customer_messages')
    .update({ is_read: true })
    .eq('conversation_id', conversationId)
    .eq('sender_type', senderType)

  if (error) throw error
}

export async function updateConversationStatus(conversationId, status) {
  const supabase = requireSupabase()

  const { data, error } = await supabase
    .from('customer_conversations')
    .update({
      status,
      updated_at: new Date().toISOString(),
    })
    .eq('id', conversationId)
    .select(conversationColumns)
    .single()

  if (error) throw error
  return data
}

export function subscribeToCustomerMessages({ conversationId = null, onInsert }) {
  const supabase = requireSupabase()
  const channelName = conversationId
    ? `customer_messages:${conversationId}`
    : 'customer_messages:admin'

  let channel = supabase.channel(channelName)
  const filter = conversationId ? `conversation_id=eq.${conversationId}` : undefined

  channel = channel.on(
    'postgres_changes',
    {
      event: 'INSERT',
      schema: 'public',
      table: 'customer_messages',
      ...(filter ? { filter } : {}),
    },
    (payload) => onInsert?.(payload.new),
  )

  channel.subscribe()
  return channel
}

export function unsubscribeChannel(channel) {
  if (!channel) return
  const supabase = requireSupabase()
  supabase.removeChannel(channel)
}
