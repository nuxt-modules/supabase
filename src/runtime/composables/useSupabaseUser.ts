import type { User } from '@supabase/supabase-js'

export const useSupabaseUser = () => {
  const supabase = useSupabaseClient()

  const user = useState<User | null>('supabase_user', () => null)

  // Asyncronous refresh session and ensure user is still logged in
  supabase?.auth.getSession().then(({ data: { session } }) => {
    if (session) {
      user.value = session.user
    }
  })

  return user
}
