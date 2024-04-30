import type { Session } from '@supabase/supabase-js'
import { useSupabaseClient } from './useSupabaseClient'
import { useState } from '#imports'

export const useSupabaseSession = async () => {
  const supabase = useSupabaseClient()

  const sessionState = useState<Session | null>('supabase_session', () => null)

  // Need to manipulate session in `supabase.client` plugin when client is not yet initialized
  if (!supabase) {
    return sessionState
  }

  const { data } = await supabase.auth.getSession()
  if (data) {
    sessionState.value = data.session
  }

  return sessionState
}
