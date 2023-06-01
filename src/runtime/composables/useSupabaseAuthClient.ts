import { useNuxtApp } from '#imports'
import type { SupabaseClient } from '@supabase/supabase-js'
import { createSupabaseClient } from '../utils/client'

export const useSupabaseAuthClient = <T>(): SupabaseClient<T> => {
  const nuxtApp = useNuxtApp()

  // Create auth client if doesn't already exist
  if (!nuxtApp._supabaseAuthClient) {
    nuxtApp._supabaseAuthClient = createSupabaseClient()
  }

  return nuxtApp._supabaseAuthClient as SupabaseClient<T>
}
