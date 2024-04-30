import type { User } from '@supabase/supabase-js'
import { useSupabaseSession } from './useSupabaseSession'
import { useSupabaseClient } from './useSupabaseClient'
import { useState } from '#imports'

export const useSupabaseUser = async () => {
  const userState = useState<User | null>('supabase_user', () => null)
  const supabase = useSupabaseClient()

  // Need to manipulate user in `supabase.client` plugin when client is not yet initialized
  if (!supabase) {
    return userState
  }

  // We do not rely on `getSession` on the server. It could be tampered with by the sender.
  if (import.meta.server) {
    const { data: { user } } = await supabase.auth.getUser()
    userState.value = user
  }
  // We rely on `getSession` on the client.
  else {
    const session = await useSupabaseSession()

    userState.value = session.value?.user ?? null
  }

  return userState
}
