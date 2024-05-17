import { createServerClient } from '@supabase/ssr'
import { getCookie, setCookie, deleteCookie } from 'h3'
import { defineNuxtPlugin, useRequestEvent, useRuntimeConfig, useSupabaseSession, useSupabaseUser } from '#imports'
import type { CookieOptions } from '#app'

export default defineNuxtPlugin({
  name: 'supabase',
  enforce: 'pre',
  async setup() {
    const event = useRequestEvent()!
    const { url, key, cookieOptions, clientOptions } = useRuntimeConfig().public.supabase

    const client = createServerClient(url, key, {
      ...clientOptions,
      cookies: {
        get: (key: string) => getCookie(event, key),
        set: (key: string, value: string, options: CookieOptions) => setCookie(event, key, value, options),
        remove: (key: string, options: CookieOptions) => deleteCookie(event, key, options),
      },
      cookieOptions,
    })

    // Initialize user and session states
    const [{ data: { session } }, { data: { user } }] = await Promise.all([
      client.auth.getSession(),
      client.auth.getUser(),
    ])
    useSupabaseSession().value = session
    useSupabaseUser().value = user

    return {
      provide: {
        supabase: { client },
      },
    }
  },
})
