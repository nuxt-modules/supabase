import type { User } from '@supabase/supabase-js'
import { useState } from '#imports'
import { useSupabaseClient } from './useSupabaseClient'
import type { Ref } from 'vue'

export const useSupabaseUser = () => {
  const supabase = useSupabaseClient()

  const user = useState<User | null>('supabase_user', () => null)

  // Asyncronous refresh session and ensure user is still logged in
  supabase?.auth.getSession().then(({ data: { session } }) => {
    if (session) {
      if (JSON.stringify(user.value) !== JSON.stringify(session.user)) {
        user.value = session.user;
      }
    } else {
      user.value = null
    }
  })

  return user as Ref<User | null>
}
