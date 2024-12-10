import type { Session } from '@supabase/supabase-js'
import type { H3Event } from 'h3'
import { serverSupabaseClient } from '../services/serverSupabaseClient'

export const serverSupabaseSession = async (event: H3Event): Promise<Omit<Session, 'user'> | null> => {
  const client = await serverSupabaseClient(event)

  const { data: { session }, error } = await client.auth.getSession()
  if (error) throw error

  // @ts-expect-error we need to delete user from the session object here to suppress the warning coming from GoTrueClient
  delete session?.user
  return session
}
