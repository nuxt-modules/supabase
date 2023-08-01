import { SupabaseClient } from '@supabase/supabase-js'
import { useNuxtApp } from '#imports'

export const useSupabaseClient = (): SupabaseClient => {
  return useNuxtApp().$supabase.client
}
