import type { Ref } from 'vue'
import { User } from '@supabase/supabase-js'
import { useSupabaseToken } from './useSupabaseToken'
import { useState } from '#imports'

export const useSupabaseUser = (): Ref<User | null> => {
  const user = useState<User | null>('supabase_user', () => null)
  const token = useSupabaseToken()

  // Check token and set user to null if not set (check for token expiration)
  if (!token.value) {
    user.value = null
  }

  return user
}
