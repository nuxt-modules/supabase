import { AuthChangeEvent, Session } from '@supabase/supabase-js'
import { useSupabaseClient } from '../composables/useSupabaseClient'
import { useSupabaseUser } from '../composables/useSupabaseUser'
import { useSupabaseToken } from '../composables/useSupabaseToken'
import { defineNuxtPlugin } from '#imports'

export default defineNuxtPlugin(async (nuxtApp) => {
  const user = useSupabaseUser()
  const client = useSupabaseClient()

  // If user has not been set on server side (for instance in SPA), set it for client
  if (!user.value) {
    const token = useSupabaseToken()
    if (token.value) {
      const { user: supabaseUser, error } = await client.auth.api.getUser(token.value)
      user.value = error ? null : supabaseUser
    }
  }

  // Once Nuxt app is mounted
  nuxtApp.hooks.hook('app:mounted', () => {
    // Listen to Supabase auth changes
    client.auth.onAuthStateChange(async (event: AuthChangeEvent, session: Session | null) => {
      await setServerSession(event, session)
      user.value = client.auth.user()
    })
  })
})

function setServerSession (event: AuthChangeEvent, session: Session | null): Promise<any> {
  return $fetch('/api/_supabase/session', {
    method: 'POST',
    body: { event, session }
  })
}
