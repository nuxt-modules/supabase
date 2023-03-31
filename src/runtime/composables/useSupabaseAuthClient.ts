import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { defu } from 'defu'
import { useSupabaseToken } from './useSupabaseToken'
import { useRuntimeConfig, useNuxtApp } from '#imports'

export const useSupabaseAuthClient = <T>(): SupabaseClient<T> => {
  const nuxtApp = useNuxtApp()

  // Create auth client if doesn't already exist
  if (!nuxtApp._supabaseAuthClient) {
    const token = useSupabaseToken()
    const authorizationHeader = token.value ? `Bearer ${token.value}` : undefined

    const { supabase: { url, key, client: clientOptions } } = useRuntimeConfig().public

    // Set auth header
    const options = authorizationHeader ? defu(clientOptions, { global: { headers: { Authorization: authorizationHeader } } }) : clientOptions

    nuxtApp._supabaseAuthClient = createClient(url, key, options)
  }

  return nuxtApp._supabaseAuthClient
}
