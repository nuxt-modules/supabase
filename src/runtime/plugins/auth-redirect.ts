import { useSupabaseUser } from '../composables/useSupabaseUser'
import { redirectToLogin } from '../utils/redirect'
import { defineNuxtPlugin, addRouteMiddleware } from '#imports'

export default defineNuxtPlugin(() => {
  addRouteMiddleware('global-auth', (to) => {
    const user = useSupabaseUser()
    if (!user.value) {
      try {
        redirectToLogin(to.path)
      } catch {}
    }
  }, { global: true })
})
