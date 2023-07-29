import { createClient } from '@supabase/supabase-js'
import { defineNuxtPlugin, useRuntimeConfig, useCookie } from '#imports'

export default defineNuxtPlugin({
  name: 'supabase',
  enforce: 'pre',
  async setup() {
    // get supabase url and key from runtime config
    const config = useRuntimeConfig().public.supabase
    const { url, key, clientOptions, cookieName, cookieOptions } = config

    const supabaseClient = createClient(url, key, clientOptions)

    supabaseClient.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        useCookie(`${cookieName}-access-token`, cookieOptions).value = session?.access_token
        useCookie(`${cookieName}-refresh-token`, cookieOptions).value = session?.access_token
      }
      if (event === 'SIGNED_OUT') {
        useCookie(`${cookieName}-access-token`, cookieOptions).value = null
        useCookie(`${cookieName}-refresh-token`, cookieOptions).value = null
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
