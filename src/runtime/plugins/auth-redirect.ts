import { useSupabaseUser } from '../composables/useSupabaseUser.mjs'
import { redirectToLogin } from '../utils/redirect.mjs'
import { defineNuxtPlugin, addRouteMiddleware } from '#imports'

export default defineNuxtPlugin(() => {
  const user = useSupabaseUser()
  addRouteMiddleware('global-auth', async (to) => {
    if (!user.value) {
      return await redirectToLogin(to.path)
    }
  }, { global: true })
})
