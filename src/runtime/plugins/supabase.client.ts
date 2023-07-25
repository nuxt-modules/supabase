import { createClient, User } from '@supabase/supabase-js'
import { defineNuxtPlugin, useState, useRuntimeConfig } from '#imports'

export default defineNuxtPlugin({
  name: 'supabase',
  enforce: 'pre',
  async setup() {
    // get supabase url and key from runtime config
    const runtime = useRuntimeConfig()
    const supabaseUrl = runtime.public.supabase.url
    const supabaseKey = runtime.public.supabase.key

    const supabaseClient = createClient(supabaseUrl, supabaseKey, {
      auth: {
        flowType: 'pkce',
        detectSessionInUrl: true,
        persistSession: true,
      },
    })

    supabaseClient.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        useState<User | null>('user', () => null).value = session?.user
        useCookie('sb-access-token', { secure: true, sameSite: 'lax' }).value = session?.access_token
        useCookie('sb-refresh-token', { secure: true, sameSite: 'lax' }).value = session?.access_token
      }
      if (event === 'SIGNED_OUT') {
        useState<User | null>('user', () => null).value = null
        useCookie('sb-access-token', { secure: true, sameSite: 'lax' }).value = null
        useCookie('sb-refresh-token', { secure: true, sameSite: 'lax' }).value = null
      }
    })

    return {
      provide: {
        supabase: {
          client: supabaseClient,
        },
      },
    }
  },
})
