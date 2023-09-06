import { defineNuxtPlugin, useRuntimeConfig, useCookie } from '#imports'
import { createClient } from '@supabase/supabase-js'
import { useSupabaseUser } from '../composables/useSupabaseUser'

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
      // Update user based on received session
      if (session) {
        if (JSON.stringify(user.value) !== JSON.stringify(session.user)) {
          user.value = session.user;
        }
      } else {
        user.value = null
      }

      // Use cookies to share session state between server and client
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        useCookie(`${cookieName}-access-token`, cookieOptions).value = session?.access_token
        useCookie(`${cookieName}-refresh-token`, cookieOptions).value = session?.refresh_token
      }
      if (event === 'SIGNED_OUT') {
        user.value = null
        useCookie(`${cookieName}-access-token`, cookieOptions).value = null
        useCookie(`${cookieName}-refresh-token`, cookieOptions).value = null
        if (session.provider_token) useCookie(`${cookieName}-provider-token`, cookieOptions).value = session.provider_token
        if (session.provider_refresh_token) useCookie(`${cookieName}-provider-refresh-token`, cookieOptions).value = session.provider_refresh_token
      }
    })

    // Attempt to retrieve existing session from local storage
    await supabaseClient.auth.getSession()

    return {
      provide: {
        supabase: {
          client: supabaseClient,
        },
      },
    }
  },
})
