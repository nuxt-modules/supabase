import type { SupabaseClient } from '@supabase/supabase-js'
import { createClient } from '@supabase/supabase-js'
import type { H3Event } from 'h3'
import { useRuntimeConfig } from '#imports'
// @ts-expect-error - `#supabase/database` is a runtime alias
import type { Database } from '#supabase/database'

export const serverSupabaseServiceRole: <T = Database>(event: H3Event) => SupabaseClient<T> = <T = Database>(event: H3Event) => {
  const {
    supabase: { serviceKey, url },
  } = useRuntimeConfig(event)

  // Make sure service key is set
  if (!serviceKey) {
    throw new Error('Missing `SUPABASE_SERVICE_KEY` in `.env`')
  }

  // No need to recreate client if exists in request context
  if (!event.context._supabaseServiceRole) {
    event.context._supabaseServiceRole = createClient(url, serviceKey, {
      auth: {
        detectSessionInUrl: false,
        persistSession: false,
        autoRefreshToken: false,
      },
    })
  }

  return event.context._supabaseServiceRole as SupabaseClient<T>
}
