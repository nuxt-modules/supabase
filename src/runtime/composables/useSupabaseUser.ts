import type { User } from '@supabase/supabase-js'

export const useSupabaseUser = () => {
  return useState<User | null>('supabase_user', () => null)
}
