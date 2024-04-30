import type { User } from '@supabase/supabase-js'
import { useSupabaseSession } from './useSupabaseSession'
import { useSupabaseClient } from './useSupabaseClient'
import { useState, createError } from '#imports'

export const useSupabaseUser = async () => {
  const userState = useState<User | undefined>('supabase_user', () => null)
  const supabase = useSupabaseClient()

  // Need to manipulate user in `supabase.client` plugin when client is not yet initialized
  if (!supabase) {
    return userState
  }

  // We do not rely on `getSession` on the server. It could be tampered with by the sender.
  if (import.meta.server) {
    const { data: { user } } = await supabase.auth.getUser()
    console.log('user on server:', !!user)
    userState.value = user
  }
  // We rely on `getSession` on the client.
  else {
    const session = await useSupabaseSession()
    console.log('user on client:', !!session.value?.user)

    userState.value = session.value?.user
  }

  return userState
}
