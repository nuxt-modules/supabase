import { useSupabaseUser } from '../composables/useSupabaseUser'
import { useSupabaseClient } from '../composables/useSupabaseClient'
import { useSupabaseToken } from '../composables/useSupabaseToken'
import { redirectToLogin } from '../utils/redirect'
import { defineNuxtPlugin } from '#imports'

// Set subabase user on server side
export default defineNuxtPlugin(async () => {
  const user = useSupabaseUser()
  const client = useSupabaseClient()
  const token = useSupabaseToken()
  const route = useRoute()

  if (!token.value) {
    return
  }

  const { data: { user: supabaseUser }, error } = await client.auth.getUser(token.value)

  if (error) {
    token.value = null
    user.value = null

    await redirectToLogin(route.path)
  } else {
    user.value = supabaseUser
  }
})
