import type { User } from '@supabase/supabase-js'
import { useSupabaseSession } from './useSupabaseSession'
import { computed, type ComputedRef } from '#imports'

export const useSupabaseUser: () => ComputedRef<User | null> = () => {
  const session = useSupabaseSession()
  const userState = computed(() => session.value?.user)
  return userState
}
