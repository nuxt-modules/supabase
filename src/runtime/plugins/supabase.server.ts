import { useSupabaseUser } from '../composables/useSupabaseUser'
import { useSupabaseClient } from '../composables/useSupabaseClient'
import { useSupabaseToken } from '../composables/useSupabaseToken'
import { defineNuxtPlugin } from '#imports'

// Set subabase user on server side
export default defineNuxtPlugin(async () => {
  const user = useSupabaseUser()
  const client = useSupabaseClient()
  const token = useSupabaseToken()

  if (!token.value) {
    user.value = null
    return redirectToLogin()
  }

  const { data: { user: supabaseUser }, error } = await client.auth.getUser(token.value)

  if (error) {
    token.value = null
    user.value = null

    return redirectToLogin()
  } else {
    user.value = supabaseUser
  }
})

const redirectToLogin = async () => {
  const redirect = useRuntimeConfig().public.supabase.redirect

  if (redirect && redirect.login) {
    const route = useRoute()
    if ([redirect.login, redirect.callback].includes(route.path)) {
      return
    }

    await navigateTo(redirect.login)
  }
}
