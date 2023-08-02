import type { User } from '@supabase/supabase-js'
import { useSupabaseClient } from './useSupabaseClient'
import { useState } from '#imports'

export const useSupabaseUser = () => {
  const supabase = useSupabaseClient()

  const user = useState<User | null>('supabase_user', () => null)

  // Asyncronous refresh session and ensure user is still logged in
  supabase?.auth.getSession().then(({ data: { session } }) => {
    if (session) {
      if (JSON.stringify(user.value) !== JSON.stringify(session.user)) {
        user.value = session.user;
      }
    }
  })

  return user
}
