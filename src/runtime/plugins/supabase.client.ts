import { defineNuxtPlugin, useRuntimeConfig, useCookie } from '#imports'
import { createClient } from '@supabase/supabase-js'

export default defineNuxtPlugin({
  name: 'supabase',
  enforce: 'pre',
  async setup() {
    const user = useSupabaseUser()
    const config = useRuntimeConfig().public.supabase
    const { url, key, cookieName, cookieOptions, clientOptions } = config

    const supabaseClient = createClient(url, key, clientOptions)

    // Handle auth event client side
    supabaseClient.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        user.value = session.user
      }

      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        useCookie(`${cookieName}-access-token`).value = session?.access_token
        useCookie(`${cookieName}-refresh-token`).value = session?.refresh_token
        if (session.provider_token) useCookie(`${cookieName}-provider-token`, cookieOptions).value = session.access_token
        if (session.provider_refresh_token) useCookie(`${cookieName}-provider-refresh-token`, cookieOptions).value = session.provider_refresh_token
      }
      if (event === 'SIGNED_OUT') {
        user.value = null
        useCookie(`${cookieName}-access-token`).value = null
        useCookie(`${cookieName}-refresh-token`).value = null
        useCookie(`${cookieName}-provider-token`, cookieOptions).value = null
        useCookie(`${cookieName}-provider-refresh-token`, cookieOptions).value = null
      }
    })

    return {
      provide: {
        supabase: {
          client: supabaseClient
        },
      },
    }
  },
})
