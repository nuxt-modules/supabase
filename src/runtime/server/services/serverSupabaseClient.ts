import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { getCookie } from 'h3'
import type { H3Event } from 'h3'
import { defu } from 'defu'
import { useRuntimeConfig } from '#imports'

export const serverSupabaseClient = (event: H3Event): SupabaseClient => {
  const { supabase: { url, key, client: clientOptions, cookies: cookieOptions } } = useRuntimeConfig().public

  // No need to recreate client if exists in request context
  if (!event.context._supabaseClient) {
    const token = getCookie(event, `${cookieOptions.name}-access-token`)

    // Set auth header to make use of RLS
    const options = token ? defu(clientOptions, { global: { headers: { Authorization: `Bearer ${token}` } } }) : clientOptions

    const supabaseClient = createClient(url, key, options)

    event.context._supabaseClient = supabaseClient
    event.context._token = token
  }

  return event.context._supabaseClient as SupabaseClient
}
