import { SupabaseClient } from '@supabase/supabase-js'
import { useNuxtApp } from '#imports'
import { createSupabaseClient } from '../utils/client'

export const useSupabaseClient = <T>(): SupabaseClient<T> => {
  const nuxtApp = useNuxtApp()
  const token = useSupabaseToken()
  const Authorization = token.value ? `Bearer ${token.value}` : undefined

  // Recreate client if token has changed
  const recreateClient = (nuxtApp._supabaseClient as any)?.headers.Authorization !== Authorization

  // No need to recreate client if exists
  if (!nuxtApp._supabaseClient || recreateClient) {
    nuxtApp._supabaseClient = createSupabaseClient()
  }

  return nuxtApp._supabaseAuthClient as SupabaseClient<T>
}
