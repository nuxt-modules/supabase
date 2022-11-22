import { useSupabaseUser } from '../composables/useSupabaseUser'
import { useSupabaseAuthClient } from '../composables/useSupabaseAuthClient'
import { useSupabaseToken } from '../composables/useSupabaseToken'
import { redirectToLogin } from '../utils/redirect'
import { defineNuxtPlugin, useRoute } from '#imports'

// Set subabase user on server side
export default defineNuxtPlugin(async () => {
  const user = useSupabaseUser()
  const authClient = useSupabaseAuthClient()
  const token = useSupabaseToken()
  const route = useRoute()

  if (!token.value) {
    return
  }

  const { data: { user: supabaseUser }, error } = await authClient.auth.getUser(token.value)

  if (error) {
    token.value = null
    user.value = null

    redirectToLogin(route.path)
  } else {
    user.value = supabaseUser
  }
})
