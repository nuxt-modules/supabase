import { AuthChangeEvent, Session } from '@supabase/supabase-js'
import { useSupabaseClient } from '../composables/useSupabaseClient'
import { useSupabaseUser } from '../composables/useSupabaseUser'
import { defineNuxtPlugin, NuxtApp } from '#app'

export default defineNuxtPlugin((nuxtApp: NuxtApp) => {
  const user = useSupabaseUser()
  const client = useSupabaseClient()

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
