import { User } from '@supabase/supabase-js'
import { useCookie } from '#imports'

export const useSupabaseUser = async (): Promise<User> => {
  const supabase = useSupabaseClient()
  const accessToken = useCookie('sb-access-token', { secure: true }).value
  const refreshToken = useCookie('sb-refresh-token', { secure: true }).value
  const result = await supabase.auth.getSession()
  if (result.data?.session?.user) return result.data.session.user
  // no user in session, try to set session from cookies on server
  if (process.server) {
    if (accessToken && refreshToken) {
      const result = await supabase.auth.setSession({
        refresh_token: refreshToken,
        access_token: accessToken,
      })
      if (result.data && result.data.user) return result.data.user
    }
  }
  return null
}
