import { User } from '@supabase/supabase-js'
import type { H3Event } from 'h3'
import { serverSupabaseClient } from '../services/serverSupabaseClient'

export const serverSupabaseUser = async (event: H3Event): Promise<User | null> => {
  const client = serverSupabaseClient(event)

  if (!event.context._token) {
    return null
  }

  const { data: { user: supabaseUser }, error } = await client.auth.getUser(event.context._token)

  event.context._user = error ? null : supabaseUser

  return event.context._user
}
