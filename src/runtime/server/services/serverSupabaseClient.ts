import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { CompatibilityEvent, getCookie } from 'h3'
import { useRuntimeConfig } from '#imports'

export const serverSupabaseClient = (event: CompatibilityEvent): SupabaseClient => {
  const { supabase: { url, key, client: clientOptions, cookies: cookieOptions } } = useRuntimeConfig().public

  // No need to recreate client if exists in request context
  if (!event.context._supabaseClient) {
    const supabaseClient = createClient(url, key, clientOptions)
    const token = getCookie(event, `${cookieOptions.name}-access-token`)

    supabaseClient.auth.setSession(token as string)

    event.context._supabaseClient = supabaseClient
    event.context._token = token
  }

  return event.context._supabaseClient as SupabaseClient
}
