import { defineNuxtPlugin, useRuntimeConfig, useCookie } from '#imports'
import { defu } from 'defu'
import { createClient } from '@supabase/supabase-js'
import { useSupabaseUser } from '../composables/useSupabaseUser'

export default defineNuxtPlugin({
  name: 'supabase',
  enforce: 'pre',
  async setup() {
    const { url, key, cookieName, clientOptions} = useRuntimeConfig().public.supabase
    const accessToken = useCookie(`${cookieName}-access-token`).value
    const refreshToken = useCookie(`${cookieName}-refresh-token`).value

    const options = defu({ auth:  {
      flowType: clientOptions.auth.flowType,
      detectSessionInUrl: false,
      persistSession: false,
      autoRefreshToken: false
    } }, clientOptions)

    const supabaseClient = createClient(url, key, options)

    // Set user & session server side
    if (accessToken && refreshToken) {
      const { data } = await supabaseClient.auth.setSession({
        refresh_token: refreshToken,
        access_token: accessToken,
      })
      if (data?.user) {
        useSupabaseUser().value = data.user
      }
    }

    return {
      provide: {
        supabase: {
          client: supabaseClient
        },
      },
    }
  },
})
