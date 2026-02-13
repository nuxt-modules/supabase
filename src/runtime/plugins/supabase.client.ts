import { createBrowserClient } from '@supabase/ssr'
import { type Session, type SupabaseClient, createClient } from '@supabase/supabase-js'
import { fetchWithRetry } from '../utils/fetch-retry'
import { useSupabaseSession } from '../composables/useSupabaseSession'
import { useSupabaseUser } from '../composables/useSupabaseUser'
import type { Plugin } from '#app'
import { defineNuxtPlugin, useRuntimeConfig, useNuxtApp } from '#imports'

export default defineNuxtPlugin({
  name: 'supabase',
  enforce: 'pre',
  async setup({ provide }) {
    const nuxtApp = useNuxtApp()
    const { url, key, cookieOptions, cookiePrefix, useSsrCookies, clientOptions } = useRuntimeConfig().public.supabase

    let client

    if (useSsrCookies) {
      client = createBrowserClient(url, key, {
        ...clientOptions,
        cookieOptions: {
          ...cookieOptions,
          name: cookiePrefix,
        },
        isSingleton: true,
        global: {
          fetch: fetchWithRetry,
          ...clientOptions.global,
        },
      })
    }
    else {
      client = createClient(url, key, {
        ...clientOptions,
        global: {
          fetch: fetchWithRetry,
          ...clientOptions.global,
        },
      })
    }

    provide('supabase', { client })

    const currentSession = useSupabaseSession()
    const currentUser = useSupabaseUser()

    // In SPA mode, restore session from storage before auth middleware runs
    // This prevents a race condition where middleware checks session before it's hydrated
    // See: https://github.com/nuxt-modules/supabase/issues/496
    if (!useSsrCookies) {
      const { data } = await client.auth.getSession()
      if (data.session) {
        currentSession.value = data.session
      }
    }

    // Populate user before each page load to ensure the user state is correctly set before the page is rendered
    nuxtApp.hook('page:start', async () => {
      const { data } = await client.auth.getClaims()
      currentUser.value = data?.claims ?? null
    })

    // Updates the session and user states through auth events
    client.auth.onAuthStateChange((_, session: Session | null) => {
      if (JSON.stringify(currentSession.value) !== JSON.stringify(session)) {
        currentSession.value = session
        if (session?.user) {
          client.auth.getClaims().then(({ data }) => {
            currentUser.value = data?.claims ?? null
          })
        }
        else {
          currentUser.value = null
        }
      }
    })
  },
}) as Plugin<{ client: SupabaseClient }>
