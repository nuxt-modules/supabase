import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { CompatibilityEvent } from 'h3'
import { useRuntimeConfig } from '#imports'

export const serverSupabaseServiceRole = (event: CompatibilityEvent): SupabaseClient => {
  const { supabase: { serviceRoleKey }, public: { supabase: { url, client: clientOptions } } } = useRuntimeConfig()

  // Make sure service key is set
  if (!serviceRoleKey) {
    throw new Error('Missing `SUPABASE_SERVICE_KEY` in `.env`')
  }

  // No need to recreate client if exists in request context
  if (!event.context._supabaseClient) {
    const supabaseClient = createClient(url, serviceRoleKey, clientOptions)

    event.context._supabaseClient = supabaseClient
  }

  return event.context._supabaseClient
}
