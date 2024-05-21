import { createServerClient } from '@supabase/ssr'
import { getCookie, setCookie, deleteCookie } from 'h3'
import { defineNuxtPlugin, useRequestEvent, useRuntimeConfig, useSupabaseSession, useSupabaseUser } from '#imports'
import type { CookieOptions, NuxtApp } from '#app'

export default defineNuxtPlugin({
  name: 'supabase',
  enforce: 'pre',
  async setup(nuxtApp) {
    const { url, key, cookieOptions, clientOptions } = useRuntimeConfig().public.supabase

    const client = createServerClient(url, key, {
      ...clientOptions,
      cookies: {
        get: (key: string) => getCookie(useRequestEvent(nuxtApp as NuxtApp)!, key),
        set: (key: string, value: string, options: CookieOptions) => {
          const event = useRequestEvent(nuxtApp as NuxtApp)!
          if (!event.node.res.headersSent) {
            setCookie(event, key, value, options)
          }
        },
        remove: (key: string, options: CookieOptions) => {
          const event = useRequestEvent(nuxtApp as NuxtApp)!
          if (!event.node.res.headersSent) {
            deleteCookie(event, key, options)
          }
        },
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
