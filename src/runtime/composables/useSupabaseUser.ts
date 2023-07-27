import { User } from '@supabase/supabase-js'
import { CookieOptions } from '../types'
import { useCookie, useRuntimeConfig } from '#imports'
import { useSupabaseClient } from '../composables/useSupabaseClient'

export const useSupabaseUser = async (): Promise<User> => {
  const supabase = useSupabaseClient()

  // get cookie setting from runtime config
  const runtime = useRuntimeConfig()
  const { name, sameSite, ...options } = runtime.public.supabase.cookieOptions
  const cookieOptions: CookieOptions = {
    ...options,
    sameSite: sameSite as boolean | 'lax' | 'strict' | 'none',
  }
  const accessToken = useCookie(`${name}-access-token`, cookieOptions).value
  const refreshToken = useCookie(`${name}-refresh-token`, cookieOptions).value

  // check for session on client and server respectively
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
