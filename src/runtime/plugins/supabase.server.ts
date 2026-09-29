import { createServerClient, parseCookieHeader } from '@supabase/ssr'
import { getHeader } from 'h3'
import type { SupabaseClient } from '@supabase/supabase-js'
import { fetchWithRetry } from '../utils/fetch-retry'
import { preferTimezone } from '../utils/prefer-timezone'
import { setCookies } from '../utils/cookies'
import { serverSupabaseUser, serverSupabaseSession } from '../server/services'
import { useSupabaseSession } from '../composables/useSupabaseSession'
import { useSupabaseUser } from '../composables/useSupabaseUser'
import { defineNuxtPlugin, useRequestEvent, useRuntimeConfig } from '#imports'
import type { CookieOptions, Plugin } from '#app'

export default defineNuxtPlugin({
  name: 'supabase',
  enforce: 'pre',
  async setup({ provide }) {
    const {
      url,
      key,
      cookiePrefix,
      useSsrCookies,
      cookieOptions,
      clientOptions,
      timezone,
    } = useRuntimeConfig().public.supabase

    const event = useRequestEvent()!

    const client = createServerClient(url, key, {
      ...clientOptions,
      cookies: {
        getAll: () => parseCookieHeader(getHeader(event, 'Cookie') ?? ''),
        setAll: (
          cookies: { name: string, value: string, options: CookieOptions }[],
          headers: Record<string, string>,
        ) => setCookies(event, cookies, headers),
      },
      cookieOptions: {
        ...cookieOptions,
        name: cookiePrefix,
      },
      global: {
        fetch: fetchWithRetry,
        ...clientOptions.global,
        // 'browser' names a zone only the browser knows, so the server sends none and PostgREST
        // answers on its own zone.
        ...(timezone && timezone !== 'browser'
          ? { headers: preferTimezone(timezone, clientOptions.global?.headers) }
          : {}),
      },
    })

    provide('supabase', { client })

    // Initialize user and session states if available.
    if (useSsrCookies) {
      const [session, user] = await Promise.all([
        serverSupabaseSession(event).catch(() => null),
        serverSupabaseUser(event).catch(() => null),
      ])

      useSupabaseSession().value = session
      useSupabaseUser().value = user
    }
  },
}) as Plugin<{ client: SupabaseClient }>
