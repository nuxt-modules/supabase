import { createClient, SupabaseClient } from '@supabase/supabase-js'
import type { H3Event } from 'h3'
import { useRuntimeConfig } from '#imports'

export const serverSupabaseServiceRole = <T>(event: H3Event): SupabaseClient<T> => {
  const {
    supabase: { serviceKey },
    public: {
      supabase: { url }
    }
  } = useRuntimeConfig()

  // Make sure service key is set
  if (!serviceKey) {
    throw new Error('Missing `SUPABASE_SERVICE_KEY` in `.env`')
  }

  // No need to recreate client if exists in request context
  if (!event.context._supabaseServiceRole) {
    const auth = {
      detectSessionInUrl: false,
      persistSession: false,
      autoRefreshToken: false
    }

    const supabaseClient = createClient(url, serviceKey, { auth })

    event.context._supabaseServiceRole = supabaseClient
  }

  return event.context._supabaseServiceRole as SupabaseClient<T>
}
