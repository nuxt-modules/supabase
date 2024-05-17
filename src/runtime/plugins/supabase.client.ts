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

    const client = createBrowserClient(url, key, {
      ...clientOptions,
      cookieOptions,
      isSingleton: true,
    })

    const currentSession = await useSupabaseSession()
    const currentUser = useSupabaseUser()

    // Initializes and subsequently updates the session and user states through auth events
    client.auth.onAuthStateChange((_, session: Session | null) => {
      if (JSON.stringify(currentSession.value) !== JSON.stringify(session)) {
        currentSession.value = session
        currentUser.value = session?.user ?? null
      }
    })

    return {
      provide: {
        supabase: { client },
      },
    }
  },
})
