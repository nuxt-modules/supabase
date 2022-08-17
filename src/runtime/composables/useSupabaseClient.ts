import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { defu } from 'defu'
import { useSupabaseToken } from './useSupabaseToken'
import { useRuntimeConfig, useNuxtApp } from '#imports'

export const useSupabaseClient = (): SupabaseClient => {
  const nuxtApp = useNuxtApp()
  const token = useSupabaseToken()

  const { supabase: { url, key, client: clientOptions } } = useRuntimeConfig().public

  // Set auth header to make use of RLS
  const options = defu(clientOptions, { global: { headers: { Authorization: `Bearer ${token.value}` } } })

  // No need to recreate client if exists
  if (!nuxtApp._supabaseClient) {
    nuxtApp._supabaseClient = createClient(url, key, options)
  }

  return nuxtApp._supabaseClient
}
