import { useSupabaseUser } from '../composables/useSupabaseUser'
import { defineNuxtPlugin, addRouteMiddleware, defineNuxtRouteMiddleware, useCookie, useRuntimeConfig, navigateTo } from '#imports'

export default defineNuxtPlugin({
  name: 'auth-redirect',
  setup () {
    addRouteMiddleware(
      'global-auth',
      defineNuxtRouteMiddleware((to) => {
        const config = useRuntimeConfig().public.supabase
        const { login, callback, exclude, cookieRedirect } = config.redirectOptions
        const { cookieName, cookieOptions } = config

        // Do not redirect on login route, callback route and excluded routes
        const isExcluded = [...exclude, login, callback]?.some((path) => {
          const regex = new RegExp(`^${path.replace(/\*/g, '.*')}$`)
          return regex.test(to.path)
        })
        if (isExcluded) { return }

        const user = useSupabaseUser()
        if (!user.value) {
          if (cookieRedirect) { useCookie(`${cookieName}-redirect-path`, cookieOptions).value = to.fullPath }
          return navigateTo(login)
        }
      }),
      { global: true }
    )
  }
})
