import { createServerClient } from '@supabase/ssr'
import { defineNuxtPlugin, useRuntimeConfig, useCookie } from '#imports'

export default defineNuxtPlugin({
  name: 'supabase',
  enforce: 'pre',
  async setup() {
    const { url, key, cookieOptions } = useRuntimeConfig().public.supabase

    const supabaseClient = createServerClient(url, key, {
      cookies: { get: (key: string) => useCookie(key, cookieOptions).value },
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
