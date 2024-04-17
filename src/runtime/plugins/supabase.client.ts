import { createClient } from '@supabase/supabase-js'
import { useSupabaseUser } from '../composables/useSupabaseUser'
import { useSupabaseSession } from '../composables/useSupabaseSession'
import { defineNuxtPlugin, useRuntimeConfig, useCookie } from '#imports'

export default defineNuxtPlugin({
  name: 'supabase',
  enforce: 'pre',
  async setup () {
    const currentSession = useSupabaseSession()
    const config = useRuntimeConfig().public.supabase
    const { url, key, cookieName, cookieOptions, clientOptions } = config

    const supabaseClient = createClient(url, key, clientOptions)

    const accessToken = useCookie(`${cookieName}-access-token`, cookieOptions)
    const refreshToken = useCookie(`${cookieName}-refresh-token`, cookieOptions)
    const providerToken = useCookie(`${cookieName}-provider-token`, cookieOptions)
    const providerRefreshToken = useCookie(`${cookieName}-provider-refresh-token`, cookieOptions)

    // Handle auth event client side
    supabaseClient.auth.onAuthStateChange((event, session) => {
      // Update states based on received session
      if (session) {
        if (JSON.stringify(currentSession) !== JSON.stringify(session)) {
          currentSession.value = session
        }
      } else {
        currentSession.value = null
      }

      // Use cookies to share session state between server and client
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        accessToken.value = session?.access_token
        refreshToken.value = session?.refresh_token
        if (session.provider_token) { providerToken.value = session.provider_token }
        if (session.provider_refresh_token) { providerRefreshToken.value = session.provider_refresh_token }
      }
      if (event === 'SIGNED_OUT') {
        accessToken.value = null
        refreshToken.value = null
        providerToken.value = null
        providerRefreshToken.value = null
      }
    })

    // Attempt to retrieve existing session from local storage
    await supabaseClient.auth.getSession()

    return {
      provide: {
        supabase: {
          client: supabaseClient
        }
      }
    }
  }
})
