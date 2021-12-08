import { SupabaseClientOptions } from '@supabase/supabase-js'

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

  export interface SupabaseOptions {
    /**
     * Supabase API URL
     * @default process.env.SUPABASE_URL
     * @example 'https://*.supabase.co'
     * @type string
     * @docs https://supabase.com/docs/reference/javascript/initializing#parameters
     */
    url: string

    /**
     * Supabase API key
     * @default process.env.SUPABASE_KEY
     * @example '123456789'
     * @type string
     * @docs https://supabase.com/docs/reference/javascript/initializing#parameters
     */
    key: string

    /**
     * Supabase Client options
     * @default {}
     * @type object
     * @docs https://supabase.com/docs/reference/javascript/initializing#parameters
     */
    options?: SupabaseClientOptions
  }
