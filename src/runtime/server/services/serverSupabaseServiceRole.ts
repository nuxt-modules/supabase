import type { SupabaseClient } from '@supabase/supabase-js'
import { createClient } from '@supabase/supabase-js'
import type { H3Event } from 'h3'
import { useRuntimeConfig } from '#imports'
import type { Database, Schema } from '#build/types/supabase-database'

export const serverSupabaseServiceRole = <T = Database, S extends string & keyof T = Schema>(event: H3Event): SupabaseClient<T, S> => {
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
