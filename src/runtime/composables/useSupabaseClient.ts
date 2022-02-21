import { createClient, SupabaseClient } from '@supabase/supabase-js'
// import { useCookie } from 'h3'
import { useRuntimeConfig, useNuxtApp } from '#app'
import { useSupabaseToken } from './useSupabaseToken'

let supabase: SupabaseClient

export const useSupabaseClient = (): SupabaseClient => {
  const nuxtApp = useNuxtApp()
  const token = useSupabaseToken()
  const { supabase: { url, key, options } } = useRuntimeConfig()

  // No need to recreate client if exists
  if (!supabase) {
    supabase = createClient(url, key, options)

    //  Inject user's access_token in supabase client to make use of RLS on the server side
    if (nuxtApp.ssrContext) {
      supabase.auth.setAuth(token.value)
    }
  }

  return supabase
}
