import type { SupabaseClient } from '@supabase/supabase-js'
import { useNuxtApp } from '#imports'
import type { Database, Schema } from '#build/types/supabase-database'

export const useSupabaseClient = <T = Database, S extends string & keyof T = Schema>() => {
  return useNuxtApp().$supabase?.client as SupabaseClient<T, S>
}
