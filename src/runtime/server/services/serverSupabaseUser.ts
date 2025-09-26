import type { JwtPayload } from '@supabase/supabase-js'
import type { H3Event } from 'h3'
import { createError } from 'h3'
import { serverSupabaseClient } from '../services/serverSupabaseClient'

export const serverSupabaseUser = async (event: H3Event): Promise<JwtPayload | null> => {
  const client = await serverSupabaseClient(event)

  const { data, error } = await client.auth.getClaims()
  if (error) {
    throw createError({ statusMessage: error?.message })
  }

  return data?.claims ?? null
}
