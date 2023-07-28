import { createClient } from '@supabase/supabase-js'
import { useRuntimeConfig, defineNuxtPlugin } from '#imports'

export default defineNuxtPlugin({
  name: 'supabase',
  enforce: 'pre',
  async setup() {
    // get supabase url and key from runtime config
    const config = useRuntimeConfig().public.supabase
    const { url, key } = config

    const supabaseClient = createClient(url, key, {
      auth: {
        flowType: 'pkce',
        autoRefreshToken: false,
        persistSession: false,
        detectSessionInUrl: false,
      },
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
