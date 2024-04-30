import type { SupabaseClient } from '@supabase/supabase-js'
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { deleteCookie, getCookie, setCookie, type H3Event } from 'h3'
import { useRuntimeConfig } from '#imports'

export const serverSupabaseClient = async <T>(event: H3Event): Promise<SupabaseClient<T>> => {
  // get settings from runtime config
  const {
    supabase: { url, key, cookieOptions, clientOptions: { auth = {} } },
  } = useRuntimeConfig().public

  let supabaseClient = event.context._supabaseClient as SupabaseClient<T>

  // No need to recreate client if exists in request context
  if (!supabaseClient) {
    event.context._supabaseClient = supabaseClient = createServerClient(url, key, {
      auth,
      cookies: {
        get: (key: string) => getCookie(event, key),
        set: (key: string, value: string, options: CookieOptions) => setCookie(event, key, value, options),
        remove: (key: string, options: CookieOptions) => deleteCookie(event, key, options),
      },
      cookieOptions,
    })
  }

  return supabaseClient
}
