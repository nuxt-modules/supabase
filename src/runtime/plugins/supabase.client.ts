import { createClient } from '@supabase/supabase-js'
import { defineNuxtPlugin, useRuntimeConfig, useCookie } from '#imports'
import { CookieOptions } from '../types'

export default defineNuxtPlugin({
  name: 'supabase',
  enforce: 'pre',
  async setup() {
    // get supabase url and key from runtime config
    const config = useRuntimeConfig().public.supabase
    const { url, key } = config

    const supabaseClient = createClient(url, key, {
      auth: {
        flowType: 'pkce',
        detectSessionInUrl: true,
        persistSession: true,
      },
    })

    supabaseClient.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        const { name, sameSite, ...options } = config.cookieOptions
        const cookieOptions: CookieOptions = {
          ...options,
          sameSite: sameSite as boolean | 'lax' | 'strict' | 'none',
        }
        useCookie(`${name}-access-token`, cookieOptions).value = session?.access_token
        useCookie(`${name}-refresh-token`, cookieOptions).value = session?.access_token
      }
      if (event === 'SIGNED_OUT') {
        const { name, sameSite, ...options } = config.cookieOptions
        const cookieOptions: CookieOptions = {
          ...options,
          sameSite: sameSite as boolean | 'lax' | 'strict' | 'none',
        }
        useCookie(`${name}-access-token`, cookieOptions).value = null
        useCookie(`${name}-refresh-token`, cookieOptions).value = null
      }
    })

    return {
      provide: {
        supabase: {
          client: supabaseClient,
        },
      },
    }
  },
})
