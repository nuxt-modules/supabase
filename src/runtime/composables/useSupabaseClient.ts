import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { useSupabaseToken } from './useSupabaseToken'
import { useRuntimeConfig, useNuxtApp } from '#imports'

export const useSupabaseClient = (schema?: string): SupabaseClient => {
  const nuxtApp = useNuxtApp()
  const token = useSupabaseToken()
  const { supabase: { url, key, client: options } } = useRuntimeConfig().public
  
  // override the default schema if optional parameter has been set
  options.schema = schema || 'public';
  
  // No need to recreate client if exists
  if (!nuxtApp._supabaseClient) {
    nuxtApp._supabaseClient = createClient(url, key, options)

    //  Inject user's access_token in supabase client to make use of RLS on the server side
    if (nuxtApp.ssrContext) {
      nuxtApp._supabaseClient.auth.setAuth(token.value)
    }
  }

  return nuxtApp._supabaseClient
}
