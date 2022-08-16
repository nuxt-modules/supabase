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
    return
  }

  const { data: { user: supabaseUser }, error } = await client.auth.getUser(token.value)

  if (error) {
    token.value = null
    user.value = null
  } else {
    user.value = supabaseUser
  }
})
