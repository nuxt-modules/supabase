import { User } from '@supabase/supabase-js'
import type { CompatibilityEvent } from 'h3'
import { serverSupabaseClient } from '../services/serverSupabaseClient'

export const serverSupabaseUser = async (event: CompatibilityEvent): Promise<User | null> => {
  const client = serverSupabaseClient(event)

  if (!event.context._token) {
    return null
  }

  const { data: { user: supabaseUser }, error } = await client.auth.getUser(event.context._token)

  event.context._user = error ? null : supabaseUser

  return event.context._user
}
