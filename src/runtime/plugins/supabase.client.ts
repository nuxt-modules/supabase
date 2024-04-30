import { createBrowserClient } from '@supabase/ssr'
import { useSupabaseSession } from '../composables/useSupabaseSession'
import { useSupabaseUser } from '../composables/useSupabaseUser'
import { defineNuxtPlugin, useRuntimeConfig } from '#imports'

export default defineNuxtPlugin({
  name: 'supabase',
  enforce: 'pre',
  async setup() {
    const config = useRuntimeConfig().public.supabase
    const { url, key, cookieOptions, clientOptions } = config

    const supabaseClient = createBrowserClient(url, key, {
      ...clientOptions,
      cookieOptions,
      isSingleton: true,
    })

    const currentSession = await useSupabaseSession()
    const currentUser = await useSupabaseUser()

    // Handle auth event client side
    supabaseClient.auth.onAuthStateChange((_, session) => {
      // Update states based on received session
      if (session) {
        if (JSON.stringify(currentSession) !== JSON.stringify(session)) {
          currentSession.value = session
          currentUser.value = session.user
        }
      }
      else {
        currentSession.value = null
        currentUser.value = null
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
