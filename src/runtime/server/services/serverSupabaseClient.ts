import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { CompatibilityEvent, useCookie } from 'h3'
import { useRuntimeConfig } from '#imports'

export const serverSupabaseClient = (event: CompatibilityEvent): SupabaseClient => {
  const { supabase: { url, key, client: clientOptions, cookies: cookieOptions } } = useRuntimeConfig().public

  // No need to recreate client if exists in request context
  if (!event.context._supabaseClient) {
    const supabaseClient = createClient(url, key, clientOptions)
    const token = useCookie(event, `${cookieOptions.name}-access-token`)

    supabaseClient.auth.setAuth(token)

    event.context._supabaseClient = supabaseClient
    event.context._token = token
  }

  return event.context._supabaseClient as SupabaseClient
}
