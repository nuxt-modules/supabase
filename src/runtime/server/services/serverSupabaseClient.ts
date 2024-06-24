import type { SupabaseClient } from '@supabase/supabase-js'
import { createServerClient, parseCookieHeader, type CookieOptions } from '@supabase/ssr'
import { getHeader, setCookie, type H3Event } from 'h3'
import { useRuntimeConfig } from '#imports'

export const serverSupabaseClient = async <T>(event: H3Event): Promise<SupabaseClient<T>> => {
  // No need to recreate client if exists in request context
  if (!event.context._supabaseClient) {
    // get settings from runtime config
    const {
      supabase: {
        url,
        key,
        cookieOptions,
        clientOptions: { auth = {} },
      },
    } = useRuntimeConfig().public

    event.context._supabaseClient = createServerClient(url, key, {
      auth,
      cookies: {
        getAll: () => parseCookieHeader(getHeader(event, 'Cookie')),
        setAll: (
          cookies: {
            name: string
            value: string
            options: CookieOptions
          }[],
        ) => cookies.forEach(({ name, value, options }) => setCookie(event, name, value, options)),
      },
      cookieOptions,
    })
  }

  return event.context._supabaseClient
}
