import { createServerClient } from '@supabase/ssr'
import { defineNuxtPlugin, useRequestEvent, useRuntimeConfig } from '#imports'
import { getCookie } from 'h3'

export default defineNuxtPlugin({
  name: 'supabase',
  enforce: 'pre',
  async setup() {
    const { url, key, cookieOptions, clientOptions } = useRuntimeConfig().public.supabase

    const event = useRequestEvent()

    const supabaseClient = createServerClient(url, key, {
      ...clientOptions,
      cookies: { get: (key: string) => getCookie(event!, key) },
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
