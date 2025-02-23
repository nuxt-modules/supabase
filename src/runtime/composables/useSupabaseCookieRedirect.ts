import type { CookieRef } from 'nuxt/app'
import { useRuntimeConfig, useCookie, useRoute } from '#imports'

export interface UseSupabaseCookieRedirectReturn {
  /**
   * The reactive value of the redirect path cookie.
   * Can be both read and written to.
   */
  path: CookieRef<string | null>
  /**
   * Get the current redirect path cookie value, then clear it
   */
  pluck: () => string | null
}

export const useSupabaseCookieRedirect = (): UseSupabaseCookieRedirectReturn => {
  const config = useRuntimeConfig().public.supabase

  // Use cookiePrefix if saveRedirectToCookie is true, otherwise fallback to the deprecated cookieName
  const prefix = config.redirectOptions.saveRedirectToCookie
    ? config.cookiePrefix
    : config.cookieName

  const cookie: CookieRef<string | null> = useCookie(
    `${prefix}-redirect-path`,
    {
      ...config.cookieOptions,
      readonly: false,
    },
  )

  return {
    path: cookie,
    pluck: () => {
      const value = cookie.value
      cookie.value = null
      return value
    },
  }
}
