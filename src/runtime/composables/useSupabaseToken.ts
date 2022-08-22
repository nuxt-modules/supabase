import { useSupabaseUser } from './useSupabaseUser'
import { useCookie, useRuntimeConfig } from '#imports'

export const useSupabaseToken = () => {
  const user = useSupabaseUser()
  const { supabase: { cookies: cookieOptions } } = useRuntimeConfig().public
  const cookieName = `${cookieOptions.name}-access-token`

  const token = useCookie(cookieName)

  // Unset user if token is null
  if (!token.value) {
    user.value = null
  }

  return token
}
