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
      cookieOptions: CookieOptions
      clientOptions: SupabaseClientOptions<string>
    }
  }
}

export interface RedirectOptions {
  login: string
  callback: string
  include?: string[]
  exclude?: string[]
  cookieRedirect?: boolean
}
