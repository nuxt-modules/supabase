import { createClient } from '@supabase/supabase-js'
import { useRuntimeConfig, defineNuxtPlugin } from '#imports'

export default defineNuxtPlugin({
  name: 'supabase',
  enforce: 'pre', // or 'post'
  async setup() {
    // get supabase url and key from runtime config
    const runtime = useRuntimeConfig()
    const supabaseUrl = runtime.public.supabase.url
    const supabaseKey = runtime.public.supabase.key

    const supabaseClient = createClient(supabaseUrl, supabaseKey, {
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
