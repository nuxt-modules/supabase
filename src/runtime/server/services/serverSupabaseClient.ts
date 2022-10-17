import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { CompatibilityEvent, getCookie } from 'h3'
import { defu } from 'defu'
import { useRuntimeConfig } from '#imports'

export const serverSupabaseClient = (event: CompatibilityEvent): SupabaseClient => {
  const { supabase: { url, key, client: clientOptions, cookies: cookieOptions } } = useRuntimeConfig().public

  // No need to recreate client if exists in request context
  if (!event.context._supabaseClient) {
    const token = getCookie(event, `${cookieOptions.name}-access-token`)

    // Set auth header to make use of RLS
    const options = defu(clientOptions, { global: { headers: { Authorization: `Bearer ${token}` } } })

    const supabaseClient = createClient(url, key, options)

    event.context._supabaseClient = supabaseClient
    event.context._token = token
  }

  return event.context._supabaseClient as SupabaseClient
}
