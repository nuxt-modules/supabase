import { createServerClient, parseCookieHeader } from '@supabase/ssr'
import { getHeader, setCookie } from 'h3'
import type { SupabaseClient } from '@supabase/supabase-js'
import { fetchWithRetry } from '../utils/fetch-retry'
import { serverSupabaseUser, serverSupabaseSession } from '../server/services'
import { defineNuxtPlugin, useRequestEvent, useRuntimeConfig, useSupabaseSession, useSupabaseUser } from '#imports'
import type { CookieOptions, Plugin } from '#app'

export default defineNuxtPlugin({
  name: 'supabase',
  enforce: 'pre',
  async setup({ provide }) {
    const { url, key, cookiePrefix, useSsrCookies, cookieOptions, clientOptions } = useRuntimeConfig().public.supabase

    const event = useRequestEvent()!

    const client = createServerClient(url, key, {
      ...clientOptions,
      cookies: {
        getAll: () => parseCookieHeader(getHeader(event, 'Cookie') ?? ''),
        setAll: (
          cookies: {
            name: string
            value: string
            options: CookieOptions
          }[],
        ) => cookies.forEach(({ name, value, options }) => setCookie(event, name, value, options)),
      },
      cookieOptions: {
        ...cookieOptions,
        name: cookiePrefix,
      },
      global: {
        fetch: fetchWithRetry,
        ...clientOptions.global,
      },
    })

    provide('supabase', { client })

    // Initialize user and session states if available.
    if (useSsrCookies) {
      const [
        session,
        user,
      ] = await Promise.all([
        serverSupabaseSession(event).catch(() => null),
        serverSupabaseUser(event).catch(() => null),
      ])

      useSupabaseSession().value = session
      useSupabaseUser().value = user
    }
  },
}) as Plugin<{ client: SupabaseClient }>
