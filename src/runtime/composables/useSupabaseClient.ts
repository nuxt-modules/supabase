import { SupabaseClient } from '@supabase/supabase-js'
import { useNuxtApp } from '#imports'

export const useSupabaseClient = (): SupabaseClient => {
  const supabase = useNuxtApp().$supabase.client
  return supabase
}
