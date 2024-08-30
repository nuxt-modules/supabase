import type { Plugin } from '#app'
import type { Ref } from '#imports'
import { defineNuxtPlugin, addRouteMiddleware, defineNuxtRouteMiddleware, useCookie, useRuntimeConfig, navigateTo, useSupabaseSession } from '#imports'
import type { RouteLocationNormalized } from '#vue-router'

export default defineNuxtPlugin({
  name: 'auth-redirect',
  setup() {
    addRouteMiddleware(
      'global-auth',
      defineNuxtRouteMiddleware((to: RouteLocationNormalized) => {
        const config = useRuntimeConfig().public.supabase
        const { login, callback, include, exclude, cookieRedirect } = config.redirectOptions
        const { cookieName, cookieOptions } = config

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
          if (cookieRedirect) {
            (useCookie(`${cookieName}-redirect-path`, { ...cookieOptions, readonly: false }) as Ref).value = to.fullPath
          }

          return navigateTo(login)
        }
      }),
      { global: true },
    )
  },
}) as Plugin
