import { createServerClient, parseCookieHeader } from '@supabase/ssr'
import { getHeader, setCookie } from 'h3'
import { fetchWithRetry } from '../utils/fetch-retry'
import { defineNuxtPlugin, useRequestEvent, useRuntimeConfig, useSupabaseSession, useSupabaseUser } from '#imports'
import type { CookieOptions } from '#app'

export default defineNuxtPlugin({
  name: 'supabase',
  enforce: 'pre',
  async setup() {
    const { url, key, cookieOptions, clientOptions } = useRuntimeConfig().public.supabase

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
      cookieOptions,
      global: {
        fetch: fetchWithRetry,
        ...clientOptions.global,
      },
    })

    // Initialize user and session states
    const [
      {
        data: { session },
      },
      {
        data: { user },
      },
    ] = await Promise.all([client.auth.getSession(), client.auth.getUser()])
    // @ts-expect-error we need to delete user from the session object here to suppress the warning coming from GoTrueClient
    delete session?.user
    useSupabaseSession().value = session
    useSupabaseUser().value = user

    return {
      provide: {
        supabase: { client },
      },
    }
  },
})
