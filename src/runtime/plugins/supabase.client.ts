import { AuthChangeEvent, Session } from '@supabase/supabase-js'
import { useSupabaseAuthClient } from '../composables/useSupabaseAuthClient'
import { useSupabaseUser } from '../composables/useSupabaseUser'
import { useSupabaseToken } from '../composables/useSupabaseToken'
import { defineNuxtPlugin } from '#imports'

export default defineNuxtPlugin(async (nuxtApp) => {
  const user = useSupabaseUser()
  const authClient = useSupabaseAuthClient()

  // If user has not been set on server side (for instance in SPA), set it for client
  if (!user.value) {
    const token = useSupabaseToken()
    if (token.value) {
      const { data: { user: supabaseUser }, error } = await authClient.auth.getUser(token.value)

      if (error) {
        token.value = null
        user.value = null
      } else {
        user.value = supabaseUser
      }
    }
  }

  // Once Nuxt app is mounted
  nuxtApp.hooks.hook('app:mounted', () => {
    // Listen to Supabase auth changes
    authClient.auth.onAuthStateChange(async (event: AuthChangeEvent, session: Session | null) => {
      await setServerSession(event, session)
      const userResponse = session ? await authClient.auth.getUser() : null
      user.value = userResponse ? userResponse.data.user : null
    })
  })
})

const setServerSession = (event: AuthChangeEvent, session: Session | null) => {
  return $fetch('/api/_supabase/session', {
    method: 'POST',
    body: { event, session }
  })
}
