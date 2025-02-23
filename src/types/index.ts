import type { SupabaseClientOptions } from '@supabase/supabase-js'
import type { CookieOptions } from 'nuxt/app'

declare module '@nuxt/schema' {
  interface PublicRuntimeConfig {
    supabase: {
      url: string
      key: string
      redirect: boolean
      redirectOptions: RedirectOptions
      cookieName: string
      cookiePrefix: string
      useSsrCookies: boolean
      cookieOptions: CookieOptions
      types: string | false
      clientOptions: SupabaseClientOptions<string>
    }
  }
}

export interface RedirectOptions {
  login: string
  callback: string
  include?: string[]
  exclude?: string[]
  /**
   * @deprecated Use `saveRedirectToCookie` instead.
   */
  cookieRedirect?: boolean

  /**
   * If true, the when automatically redirected the redirect path will be saved to a cookie, allowing retrieval later with the `useSupabaseRedirect` composable.
   * @default false
   */
  saveRedirectToCookie?: boolean
}
