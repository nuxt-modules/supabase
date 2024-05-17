import { createBrowserClient } from '@supabase/ssr'
import { useSupabaseSession } from '../composables/useSupabaseSession'
import { useSupabaseUser } from '../composables/useSupabaseUser'
import { defineNuxtPlugin, useRuntimeConfig } from '#imports'
import type { Session } from '@supabase/supabase-js'

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
    supabaseClient.auth.onAuthStateChange((_, session: Session | null) => {
      // Update states based on received session
      if (JSON.stringify(currentSession.value) !== JSON.stringify(session)) {
        currentSession.value = session
        currentUser.value = session?.user ?? null
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
