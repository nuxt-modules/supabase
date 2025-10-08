import type { SupabaseClient } from '@supabase/supabase-js'
import { createClient } from '@supabase/supabase-js'
import { fetchWithRetry } from '../../utils/fetch-retry'
import type { H3Event } from 'h3'
import { useRuntimeConfig } from '#imports'
// @ts-expect-error - `#supabase/database` is a runtime alias
import type { Database } from '#supabase/database'
import type { ModuleOptions } from '../../../module'

export const serverSupabaseServiceRole: <T = Database>(event: H3Event) => SupabaseClient<T> = <T = Database>(event: H3Event) => {
  const config = useRuntimeConfig(event)
  const secretKey = (config.supabase as ModuleOptions).secretKey
  const serviceKey = (config.supabase as ModuleOptions).serviceKey
  const url = config.public.supabase.url

  const serverKey = secretKey || serviceKey

  // Make sure a server key is set
  if (!serverKey) {
    throw new Error('Missing server key. Set either `SUPABASE_SECRET_KEY` (recommended) or `SUPABASE_SERVICE_KEY` (deprecated) in your environment variables.')
  }

  // No need to recreate client if exists in request context
  if (!event.context._supabaseServiceRole) {
    event.context._supabaseServiceRole = createClient(url, serverKey, {
      auth: {
        detectSessionInUrl: false,
        persistSession: false,
        autoRefreshToken: false,
      },
      global: {
        fetch: fetchWithRetry,
      },
    })
  }

  return event.context._supabaseServiceRole as SupabaseClient<T>
}
