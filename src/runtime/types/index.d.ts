import { SupabaseClientOptions } from '@supabase/supabase-js'
import { CookieOptions } from 'nuxt/app'
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

export type SupabaseAuthProvider =
  | 'github'
  | 'facebook'
  | 'google'
  | 'cognito'
  | 'twitter'
  | 'discord'
  | 'twitch'
  | 'instagram'
  | 'vk'
  | 'linkedin'
  | 'reddit'
  | 'auth0'

export interface RedirectOptions {
  login: string
  callback: string
}
