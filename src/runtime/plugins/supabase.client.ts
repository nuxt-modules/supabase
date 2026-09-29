import { createBrowserClient } from '@supabase/ssr'
import {
  type Session,
  type SupabaseClient,
  createClient,
} from '@supabase/supabase-js'
import { fetchWithRetry } from '../utils/fetch-retry'
import { preferTimezone } from '../utils/prefer-timezone'
import { useSupabaseSession } from '../composables/useSupabaseSession'
import { useSupabaseUser } from '../composables/useSupabaseUser'
import type { Plugin } from '#app'
import { defineNuxtPlugin, useRuntimeConfig, useNuxtApp } from '#imports'

export default defineNuxtPlugin({
  name: 'supabase',
  enforce: 'pre',
  async setup({ provide }) {
    const nuxtApp = useNuxtApp()
    const {
      url,
      key,
      cookieOptions,
      cookiePrefix,
      useSsrCookies,
      clientOptions,
      timezone,
    } = useRuntimeConfig().public.supabase

    // `Prefer: timezone` is the only way to tell a *view* whose day to answer on, since a view
    // cannot take one as an argument. 'browser' has to be resolved here rather than in
    // `clientOptions`, which is serialised into the build and so cannot carry a per-viewer value.
    const globalOptions = {
      fetch: fetchWithRetry,
      ...clientOptions.global,
      ...(timezone
        ? {
            headers: preferTimezone(
              timezone === 'browser' ? Intl.DateTimeFormat().resolvedOptions().timeZone : timezone,
              clientOptions.global?.headers,
            ),
          }
        : {}),
    }

    let client

    if (useSsrCookies) {
      client = createBrowserClient(url, key, {
        ...clientOptions,
        cookieOptions: {
          ...cookieOptions,
          name: cookiePrefix,
        },
        isSingleton: true,
        global: globalOptions,
      })
    }
    else {
      client = createClient(url, key, {
        ...clientOptions,
        global: globalOptions,
      })
    }

    provide('supabase', { client })

    const currentSession = useSupabaseSession()
    const currentUser = useSupabaseUser()

    // Restore session and user state from storage before auth middleware runs,
    // when not already hydrated by the server plugin (covers SPA mode).
    if (!currentSession.value) {
      const { data } = await client.auth.getSession()
      if (data.session) {
        currentSession.value = data.session
        const { data: claimsData } = await client.auth.getClaims()
        currentUser.value = claimsData?.claims ?? null
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
