import { createBrowserClient } from '@supabase/ssr'
import type { Session } from '@supabase/supabase-js'
import { useSupabaseSession } from '../composables/useSupabaseSession'
import { useSupabaseUser } from '../composables/useSupabaseUser'
import { defineNuxtPlugin, useRuntimeConfig } from '#imports'

export default defineNuxtPlugin({
  name: 'supabase',
  enforce: 'pre',
  async setup() {
    const { url, key, cookieOptions, clientOptions } = useRuntimeConfig().public.supabase

    const client = createBrowserClient(url, key, {
      ...clientOptions,
      cookieOptions,
      isSingleton: true,
    })

    const currentSession = useSupabaseSession()
    const currentUser = useSupabaseUser()

    // Initialize user and session states
    const {
      data: { session },
    } = await client.auth.getSession()
    currentSession.value = session
    currentUser.value = session?.user ?? null

    // Updates the session and user states through auth events
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
