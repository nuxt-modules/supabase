import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { defu } from 'defu'
import { useSupabaseToken } from './useSupabaseToken'
import { useRuntimeConfig, useNuxtApp } from '#imports'

export const useSupabaseAuthClient = <T>(): SupabaseClient<T> => {
  const nuxtApp = useNuxtApp()
  const token = useSupabaseToken()
  const Authorization = token.value ? `Bearer ${token.value}` : undefined

  const { supabase: { url, key, client: clientOptions } } = useRuntimeConfig().public

  // Set auth header
  const options = Authorization ? defu(clientOptions, { global: { headers: { Authorization } } }) : clientOptions

  // No need to recreate client if exists
  if (!nuxtApp._supabaseAuthClient) {
    nuxtApp._supabaseAuthClient = createClient(url, key, options)
  }

  return nuxtApp._supabaseAuthClient
}
