import { AuthChangeEvent, Session } from '@supabase/supabase-js'
import { watch } from 'vue'
import { useSupabaseClient } from '../composables/useSupabaseClient'
import { useSupabaseUser } from '../composables/useSupabaseUser'
import { useSupabaseToken } from '../composables/useSupabaseToken'
import { redirectToLogin } from '../utils/redirect'
import { defineNuxtPlugin } from '#imports'

export default defineNuxtPlugin(async (nuxtApp) => {
  const user = useSupabaseUser()
  const client = useSupabaseClient()

  // If user has not been set on server side (for instance in SPA), set it for client
  if (!user.value) {
    const token = useSupabaseToken()
    if (token.value) {
      const { data: { user: supabaseUser }, error } = await client.auth.getUser(token.value)

      if (error) {
        token.value = null
        user.value = null
      } else {
        user.value = supabaseUser
      }
    }
  }

  // Watch user to redirect on login page if not set (works when token is expired)
  watch(user, async (newUser) => {
    if (!newUser) {
      console.log('client watch redirect :')
      const route = useRoute()
      await redirectToLogin(route.path)
    }
  })

  // Once Nuxt app is mounted
  nuxtApp.hooks.hook('app:mounted', () => {
    // Listen to Supabase auth changes
    client.auth.onAuthStateChange(async (event: AuthChangeEvent, session: Session | null) => {
      await setServerSession(event, session)
      const userResponse = await client.auth.getUser()
      user.value = userResponse.data.user
    })
  })
})

const setServerSession = (event: AuthChangeEvent, session: Session | null) => {
  return $fetch('/api/_supabase/session', {
    method: 'POST',
    body: { event, session }
  })
}
