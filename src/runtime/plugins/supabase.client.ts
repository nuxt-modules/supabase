import { createBrowserClient } from '@supabase/ssr'
import { useSupabaseSession } from '../composables/useSupabaseSession'
import { defineNuxtPlugin, useRuntimeConfig, useCookie } from '#imports'

export default defineNuxtPlugin({
  name: 'supabase',
  enforce: 'pre',
  async setup() {
    const currentSession = useSupabaseSession()
    const config = useRuntimeConfig().public.supabase
    const { url, key, cookieOptions, clientOptions } = config

    const supabaseClient = createBrowserClient(url, key, {
      ...clientOptions,
      cookies: { get: (key: string) => useCookie(key, cookieOptions).value },
      cookieOptions,
      isSingleton: true,
    })

    // Handle auth event client side
    supabaseClient.auth.onAuthStateChange((_, session) => {
      // Update states based on received session
      if (session) {
        if (JSON.stringify(currentSession) !== JSON.stringify(session)) {
          currentSession.value = session
        }
      } else {
        currentSession.value = null
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
