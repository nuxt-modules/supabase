import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { useRuntimeConfig } from '#app'

let supabase: SupabaseClient

export const useSupabaseClient = (): SupabaseClient => {
  const config = useRuntimeConfig()

  // No need to recreate client if exists
  if (!supabase) {
    supabase = createClient(config.supabase.url, config.supabase.key, config.supabase.options)
  }

  return supabase
}
