import { createServerClient, parseCookieHeader } from '@supabase/ssr'
import { getHeader, setCookie } from 'h3'
import type { SupabaseClient } from '@supabase/supabase-js'
import { fetchWithRetry } from '../utils/fetch-retry'
import { serverSupabaseUser, serverSupabaseSession } from '../server/services'
import { useSupabaseSession } from '../composables/useSupabaseSession'
import { useSupabaseUser } from '../composables/useSupabaseUser'
import { defineNuxtPlugin, useRequestEvent, useRuntimeConfig } from '#imports'
import type { CookieOptions, Plugin } from '#app'

export default defineNuxtPlugin({
  name: 'supabase',
  enforce: 'pre',
  async setup({ provide }) {
    const { url, key, cookiePrefix, useSsrCookies, cookieOptions, clientOptions } = useRuntimeConfig().public.supabase

    const event = useRequestEvent()!

    // @ts-expect-error - https://supabase.com/docs/guides/auth/server-side/creating-a-client?queryGroups=environment&environment=middleware
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
        ) => {
          const response = event.node.res
          const headersWritable = () => !response.headersSent && !response.writableEnded

          if (!headersWritable()) {
            return
          }
          for (const { name, value, options } of cookies) {
            if (!headersWritable()) {
              break
            }
            setCookie(event, name, value, options)
          }
        },
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
