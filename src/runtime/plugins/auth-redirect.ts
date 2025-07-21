import { useSupabaseCookieRedirect } from '../composables/useSupabaseCookieRedirect'
import { useSupabaseSession } from '../composables/useSupabaseSession'
import type { Plugin } from '#app'
import { defineNuxtPlugin, addRouteMiddleware, defineNuxtRouteMiddleware, useRuntimeConfig, navigateTo } from '#imports'
import type { RouteLocationNormalized } from '#vue-router'

export default defineNuxtPlugin({
  name: 'auth-redirect',
  setup() {
    addRouteMiddleware(
      'global-auth',
      defineNuxtRouteMiddleware((to: RouteLocationNormalized) => {
        const config = useRuntimeConfig().public.supabase
        const { login, callback, include, exclude, cookieRedirect, saveRedirectToCookie } = config.redirectOptions

        // Redirect only on included routes (if defined)
        if (include && include.length > 0) {
          const isIncluded = include.some((path: string) => {
            const regex = new RegExp(`^${path.replace(/\*/g, '.*')}$`)
            return regex.test(to.path)
          })
          if (!isIncluded) {
            return
          }
        }

        // Do not redirect on login route, callback route and excluded routes
        const isExcluded = [...exclude ?? [], login, callback]?.some((path) => {
          const regex = new RegExp(`^${path.replace(/\*/g, '.*')}$`)
          return regex.test(to.path)
        })
        if (isExcluded) return

        const session = useSupabaseSession()
        if (!session.value) {
          // Save current path to the redirect cookie if enabled
          if (cookieRedirect || saveRedirectToCookie) {
            const redirectInfo = useSupabaseCookieRedirect()
            redirectInfo.path.value = to.fullPath
          }

          return navigateTo(login)
        }
      }),
      { global: true },
    )
  },
}) as Plugin
