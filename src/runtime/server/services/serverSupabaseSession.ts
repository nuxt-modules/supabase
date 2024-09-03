import type { Session } from '@supabase/supabase-js'
import type { H3Event } from 'h3'
import { serverSupabaseClient } from '../services/serverSupabaseClient'

export const serverSupabaseSession = async (event: H3Event): Promise<Session | null> => {
  const client = await serverSupabaseClient(event)

  const { data: { session }, error } = await client.auth.getSession()
  if (error) throw error

  return session
}
