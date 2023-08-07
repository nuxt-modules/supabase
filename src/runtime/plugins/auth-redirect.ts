import { useSupabaseClient } from '../composables/useSupabaseClient'
import { defineNuxtPlugin, addRouteMiddleware, defineNuxtRouteMiddleware, useRuntimeConfig, navigateTo } from '#imports'

export default defineNuxtPlugin({
  name: 'auth-redirect',
  setup() {
    addRouteMiddleware(
      'global-auth',
      defineNuxtRouteMiddleware(async to => {
        const config = useRuntimeConfig().public.supabase
        const { login, callback, exclude } = config.redirectOptions

        // Do not redirect on login route, callback route and excluded routes
        const isExcluded = [...exclude, login, callback]?.some((path) => {
          const regex = new RegExp(`^${path.replace(/\*/g, ".*")}$`)
          return regex.test(to.path)
        })
        if (isExcluded) return

        const supabase = useSupabaseClient()
        const { data } = await supabase.auth.getUser()
        if (!data.user) {
          return navigateTo(login)
        }
      }),
      { global: true },
    )
  },
})
