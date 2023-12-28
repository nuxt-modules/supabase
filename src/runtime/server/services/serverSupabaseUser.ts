import type { User } from '@supabase/supabase-js'
import type { H3Event } from 'h3'
import { createError } from 'h3'
import { serverSupabaseClient } from '../services/serverSupabaseClient'

export const serverSupabaseUser = async (event: H3Event): Promise<User | null> => {
  const client = await serverSupabaseClient(event)

  const { data: { session }, error } = await client.auth.getSession()
  if (error) {
    throw createError({ statusMessage: error?.message })
  }

  event.context._user = session?.user ?? null

  return event.context._user
}
