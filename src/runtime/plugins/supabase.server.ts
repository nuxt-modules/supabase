import { createServerClient } from '@supabase/ssr'
import { getCookie, setCookie, deleteCookie } from 'h3'
import { defineNuxtPlugin, useRequestEvent, useRuntimeConfig } from '#imports'
import type { CookieOptions } from '#app'

export default defineNuxtPlugin({
  name: 'supabase',
  enforce: 'pre',
  async setup() {
    const { url, key, cookieOptions, clientOptions } = useRuntimeConfig().public.supabase

    const event = useRequestEvent()!

    const supabaseClient = createServerClient(url, key, {
      ...clientOptions,
      cookies: {
        get: (key: string) => getCookie(event, key),
        set: (key: string, value: string, options: CookieOptions) => setCookie(event, key, value, options),
        remove: (key: string, options: CookieOptions) => deleteCookie(event, key, options),
      },
      cookieOptions,
    })

    return {
      provide: {
        supabase: {
          client: supabaseClient,
        },
      },
    }
  },
})
