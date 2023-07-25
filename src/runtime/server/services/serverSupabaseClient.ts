import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { getCookie } from 'h3'
import type { H3Event } from 'h3'
import { useRuntimeConfig } from '#imports'

export const serverSupabaseClient = async <T>(event: H3Event): Promise<SupabaseClient<T>> => {
  // get settings from runtime config
  const {
    supabase: { url, key, cookieOptions },
  } = useRuntimeConfig().public

  let supabaseClient = event.context._supabaseClient as SupabaseClient<T>

  // No need to recreate client if exists in request context
  if (!supabaseClient) {
    supabaseClient = createClient(url, key, {
      auth: {
        detectSessionInUrl: false,
        persistSession: false,
        autoRefreshToken: false,
      },
    })
    event.context._supabaseClient = supabaseClient
  }

  // check for authorized session
  const { data } = await supabaseClient.auth.getSession()
  if (data?.session?.user?.aud !== 'authenticated') {
    // create a session from cookies
    const accessToken = getCookie(event, `${cookieOptions.name}-access-token`)
    const refreshToken = getCookie(event, `${cookieOptions.name}-refresh-token`)

    // No need to create client if no tokens are present
    if (!accessToken || !refreshToken) return null

    // Set session from cookies
    await supabaseClient.auth.setSession({
      refresh_token: refreshToken,
      access_token: accessToken,
    })
  }
  return supabaseClient
}
