import type { User } from '@supabase/supabase-js'
import type { H3Event } from 'h3'
import { createError } from 'h3'
import { serverSupabaseClient } from '../services/serverSupabaseClient'

export const serverSupabaseUser = async (event: H3Event): Promise<User | null> => {
  const client = await serverSupabaseClient(event)

  const { data: { user }, error } = await client.auth.getUser()
  if (error) {
    throw createError({ statusMessage: error?.message })
  }

  return user
}
