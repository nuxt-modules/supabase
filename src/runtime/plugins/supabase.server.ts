import { createServerClient } from '@supabase/ssr'
import { getCookie, setCookie, deleteCookie } from 'h3'
import { defineNuxtPlugin, useRequestEvent, useRuntimeConfig, useSupabaseUser } from '#imports'
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
        get: (key: string) => getCookie(event, key),
        set: (key: string, value: string, options: CookieOptions) => setCookie(event, key, value, options),
        remove: (key: string, options: CookieOptions) => deleteCookie(event, key, options),
      },
      cookieOptions,
    })

    // Fetch user from `getUser` on server side to populate it in useSupaseUser
    const {
      data: { user },
    } = await client.auth.getUser()
    useSupabaseUser().value = user

    return {
      provide: {
        supabase: { client },
      },
    }
  },
})
