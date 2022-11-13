import { useSupabaseUser } from '../composables/useSupabaseUser'
import { redirectToLogin } from '../utils/redirect'
import { defineNuxtPlugin, addRouteMiddleware } from '#imports'

export default defineNuxtPlugin(() => {
  addRouteMiddleware('global-auth', async (to) => {
    const user = useSupabaseUser()
    if (!user.value) {
      try {
        await redirectToLogin(to.path)
      } catch {}
    }
  }, { global: true })
})
