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
      if (session) {
        await setClientSession(event, session)
        const userResponse = session ? await authClient.auth.getUser() : null
        user.value = userResponse ? userResponse.data.user : null
      } else {
        // User must be unset before session
        user.value = null
        await setClientSession(event, session)
      }
    })
  })
})

// const setServerSession = (event: AuthChangeEvent, session: Session | null) => {
//   return $fetch('/api/_supabase/session', {
//     method: 'POST',
//     body: { event, session }
//   })
// }

const setClientSession = (event: AuthChangeEvent, session: Session | null) => {
  // https://nuxt.com/docs/api/composables/use-cookie

  const config = useRuntimeConfig().public
  const cookieOptions = config.supabase.cookies

  if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
    console.info('client side create cookie', event)
    if (!session) { throw new Error('Auth session missing!') }

    const cookie1 = useCookie(
      `${cookieOptions.name}-access-token`,
      {
        domain: cookieOptions.domain,
        maxAge: cookieOptions.lifetime ?? 0,
        path: cookieOptions.path,
        sameSite: cookieOptions.sameSite as boolean | 'lax' | 'strict' | 'none'
      })
    cookie1.value = session.access_token
    console.info('cookie1', cookie1.value)

    const cookie2 = useCookie(
      `${cookieOptions.name}-refresh-token`,
      {
        domain: cookieOptions.domain,
        maxAge: cookieOptions.lifetime ?? 0,
        path: cookieOptions.path,
        sameSite: cookieOptions.sameSite as boolean | 'lax' | 'strict' | 'none'
      })
    cookie2.value = session.refresh_token
    console.info('cookie2', cookie2.value)
  }

  if (event === 'SIGNED_OUT') {
    console.info('client side clear cookie', event)

    const cookie1 = useCookie(
      `${cookieOptions.name}-access-token`,
      {
        maxAge: -1,
        path: cookieOptions.path
      })

    cookie1.value = ''

    const cookie2 = useCookie(
      `${cookieOptions.name}-refresh-token`,
      {
        maxAge: -1,
        path: cookieOptions.path
      })

    cookie2.value = ''
  }
}
