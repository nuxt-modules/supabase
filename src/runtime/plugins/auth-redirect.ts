import { useSupabaseClient } from '../composables/useSupabaseClient'
import { useSupabaseCookieRedirect } from '../composables/useSupabaseCookieRedirect'
import { useSupabaseSession } from '../composables/useSupabaseSession'
import type { Plugin } from '#app'
import { defineNuxtPlugin, addRouteMiddleware, defineNuxtRouteMiddleware, useRuntimeConfig, navigateTo, useRouter } from '#imports'
import type { RouteLocationNormalized } from '#vue-router'

function matchesAnyPattern(path: string, patterns: (string | undefined)[]): boolean {
  return patterns.some((pattern) => {
    if (!pattern) return false
    const regex = new RegExp(`^${pattern.replace(/\*/g, '.*')}$`)
    return regex.test(path)
  })
}

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
          if (!matchesAnyPattern(to.path, include)) {
            return
          }
        }

        // Do not redirect on login route, callback route and excluded routes
        const excludePatterns = [login, callback, ...(exclude ?? [])]
        if (matchesAnyPattern(to.path, excludePatterns)) {
          return
        }

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

    // Re-run the middleware on the current route when the session ends, so an open page doesn't stay on screen
    if (import.meta.client && useRuntimeConfig().public.supabase.redirectOptions.redirectOnSignOut) {
      const router = useRouter()
      useSupabaseClient().auth.onAuthStateChange((event) => {
        if (event !== 'SIGNED_OUT') return
        // Not returned: auth-js awaits callbacks while holding its lock
        const { path, query, hash } = router.currentRoute.value
        navigateTo({ path, query, hash, force: true })
      })
    }
  },
}) as Plugin
