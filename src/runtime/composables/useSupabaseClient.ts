import type { SupabaseClient } from '@supabase/supabase-js'
import { useNuxtApp } from '#imports'
import type { Database } from '#build/types/supabase-database'

export const useSupabaseClient: <T = Database>() => SupabaseClient<T> = <T = Database>() => {
  return useNuxtApp().$supabase?.client as SupabaseClient<T>
}
