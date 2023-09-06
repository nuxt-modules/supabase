import type { User } from '@supabase/supabase-js'
import { useState } from '#imports'

export const useSupabaseUser = () => {
  return useState<User | null>('supabase_user', () => null) as Ref<User | null>
}
