import { useCookie, useRuntimeConfig } from '#imports'

export const useSupabaseToken = () => {
  const { supabase: { cookies: cookieOptions } } = useRuntimeConfig().public
  const cookieName = `${cookieOptions.name}-access-token`

  return useCookie(cookieName)
}
