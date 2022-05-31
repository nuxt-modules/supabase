import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { CompatibilityEvent, useCookie } from 'h3'
import { useRuntimeConfig } from '#imports'

const makeClient = (key: string): SupabaseClient => {
  const { supabase: { url, client: clientOptions } } = useRuntimeConfig().public

  return createClient(url, key, clientOptions)
}

export const serverSupabaseClient = (event: CompatibilityEvent): SupabaseClient => {
  const { supabase: { key, cookies: cookieOptions } } = useRuntimeConfig().public

  // No need to recreate client if exists in request context
  if (event.context._supabaseClient) {
    return event.context._supabaseClient
  }

  const client = makeClient(key)
  const token = useCookie(event, `${cookieOptions.name}-access-token`)

  client.auth.setAuth(token)
  event.context._token = token
  event.context._supabaseClient = client

  return client
}

/**
 * When using service role key we do not set auth token to avoid conflicts:
 * https://github.com/supabase/supabase/issues/6277
 */
export const serverSupabaseServiceRoleClient = (event: CompatibilityEvent): SupabaseClient => {
  const { supabase: { serviceRoleKey } } = useRuntimeConfig()

  // No need to recreate client if exists in request context
  if (event.context._supabaseServiceRoleClient) {
    return event.context._supabaseServiceRoleClient
  }

  const client = makeClient(serviceRoleKey)
  event.context._supabaseServiceRoleClient = client

  return client
}
