import { useCookie, useRuntimeConfig } from '#app'

export const useSupabaseToken = () => {
  const { supabase: { cookies: cookieOptions } } = useRuntimeConfig()
  const cookieName = `${cookieOptions.name}-access-token`

  return useCookie(cookieName)
}
