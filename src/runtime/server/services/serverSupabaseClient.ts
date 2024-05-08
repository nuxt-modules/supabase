import type { SupabaseClient } from '@supabase/supabase-js'
import { createClient } from '@supabase/supabase-js'
import { getCookie } from 'h3'
import type { H3Event } from 'h3'
import { defu } from 'defu'
import { useRuntimeConfig } from '#imports'
import type { Database } from '#build/types/supabase-database'

export const serverSupabaseClient = async <T = Database>(event: H3Event): Promise<SupabaseClient<T>> => {
  // get settings from runtime config
  const {
    supabase: { url, key, cookieName, clientOptions },
  } = useRuntimeConfig().public

  let supabaseClient = event.context._supabaseClient as SupabaseClient<T>

  // No need to recreate client if exists in request context
  if (!supabaseClient) {
    // Merge defaults with user config
    const options = defu({
      auth: {
        detectSessionInUrl: false,
        persistSession: false,
        autoRefreshToken: false,
      },
    }, clientOptions)
    supabaseClient = createClient(url, key, options)
    event.context._supabaseClient = supabaseClient
  }

  // check for authorized session
  const { data } = await supabaseClient.auth.getSession()
  if (data?.session?.user?.aud !== 'authenticated') {
    // create a session from cookies
    const accessToken = getCookie(event, `${cookieName}-access-token`)
    const refreshToken = getCookie(event, `${cookieName}-refresh-token`)

    if (!accessToken || !refreshToken) {
      return supabaseClient
    }

    // Set session from cookies
    await supabaseClient.auth.setSession({
      refresh_token: refreshToken,
      access_token: accessToken,
    })
  }
  return supabaseClient
}
