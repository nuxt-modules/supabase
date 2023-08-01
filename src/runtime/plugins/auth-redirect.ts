import { useSupabaseUser } from '../composables/useSupabaseUser'
import { defineNuxtPlugin, addRouteMiddleware, defineNuxtRouteMiddleware, useRuntimeConfig, navigateTo } from '#imports'

export default defineNuxtPlugin({
  name: 'auth-redirect',
  setup() {
    addRouteMiddleware(
      'global-auth',
      defineNuxtRouteMiddleware(async to => {
        const config = useRuntimeConfig().public.supabase
        const { login, callback, exclude } = config.redirectOptions
        // exclude login and callback routes
        if (to.path === login || to.path === callback) return
        // check if route is excluded
        if (exclude && exclude.some(e => to.path.includes(e))) return
        const user = useSupabaseUser()
        if (!user.value) {
          const loginUrl = useRuntimeConfig().public.supabase.redirectOptions.login
          return navigateTo(loginUrl)
        }
      }),
      { global: true },
    )
  },
})
