import { createClient } from '@supabase/supabase-js'
import { useRuntimeConfig } from '#imports'
import defu from 'defu'
import { useSupabaseToken } from '../composables/useSupabaseToken'

export const createSupabaseClient = () => {
  const token = useSupabaseToken()
  const Authorization = token.value ? `Bearer ${token.value}` : undefined

  const { supabase: { url, key, client: clientOptions } } = useRuntimeConfig().public

  // Set auth options to fix https://github.com/supabase/gotrue-js/issues/539
  const auth = {
    detectSessionInUrl: process.server ? false : clientOptions.auth?.detectSessionInUrl,
    persistSession: process.server ? false : clientOptions.auth?.persistSession,
    autoRefreshToken: process.server ? false : clientOptions.auth?.autoRefreshToken
  }

  // Set auth header
  const options = Authorization ? defu({ auth, global: { headers: { Authorization } } }, clientOptions) : defu({ auth }, clientOptions)

  return createClient(url, key, options)
}
