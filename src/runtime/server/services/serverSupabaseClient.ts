import type { SupabaseClient } from '@supabase/supabase-js'
import { createServerClient, parseCookieHeader, type CookieOptions } from '@supabase/ssr'
import { getHeader, setCookie, type H3Event } from 'h3'
import { fetchWithRetry } from '../../utils/fetch-retry'
import { useRuntimeConfig } from '#imports'
// @ts-expect-error - `#supabase/database` is a runtime alias
import type { Database } from '#supabase/database'

export const serverSupabaseClient: <T = Database>(event: H3Event) => Promise<SupabaseClient<T>> = async <T = Database>(event: H3Event) => {
  // No need to recreate client if exists in request context
  if (!event.context._supabaseClient) {
    // get settings from runtime config
    const { url, key, cookiePrefix, cookieOptions, clientOptions: { auth = {}, global = {} } } = useRuntimeConfig().public.supabase

    event.context._supabaseClient = createServerClient(url, key, {
      auth,
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
      cookieOptions: {
        ...cookieOptions,
        name: cookiePrefix,
      },
      global: {
        fetch: fetchWithRetry,
        ...global,
      },
    })
  }

  return event.context._supabaseClient as SupabaseClient<T>
}
