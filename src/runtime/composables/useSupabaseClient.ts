import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { defu } from 'defu'
import { useSupabaseToken } from './useSupabaseToken'
import { useRuntimeConfig, useNuxtApp } from '#imports'

export const useSupabaseClient = (): SupabaseClient => {
  const nuxtApp = useNuxtApp()
  const token = useSupabaseToken()
  const Authorization = token.value ? `Bearer ${token.value}` : undefined

  const { supabase: { url, key, client: clientOptions } } = useRuntimeConfig().public

  // Set auth header to make use of RLS
  const options = defu(clientOptions, { global: { headers: { Authorization } } })

  // Recreate client if token has changed
  // const recreateClient = nuxtApp._supabaseClient?.headers.Authorization !== Authorization

  // No need to recreate client if exists
  if (!nuxtApp._supabaseClient) {
    nuxtApp._supabaseClient = createClient(url, key, options)
  }

  return nuxtApp._supabaseClient
}
