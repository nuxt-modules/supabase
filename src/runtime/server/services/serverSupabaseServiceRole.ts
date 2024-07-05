import type { SupabaseClient } from '@supabase/supabase-js'
import { createClient } from '@supabase/supabase-js'
import type { H3Event } from 'h3'
import { useRuntimeConfig } from '#imports'
import type { Database } from '#build/types/supabase-database'

export const serverSupabaseServiceRole = <T = Database>(event: H3Event): SupabaseClient<T> => {
  const {
    supabase: { serviceKey },
    public: {
      supabase: { url },
    },
  } = useRuntimeConfig()

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
