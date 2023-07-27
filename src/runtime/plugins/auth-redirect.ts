import { useSupabaseUser } from '../composables/useSupabaseUser'
import { defineNuxtPlugin, addRouteMiddleware, defineNuxtRouteMiddleware, useRuntimeConfig, navigateTo } from '#imports'

export default defineNuxtPlugin({
  name: 'auth-redirect',
  setup() {
    addRouteMiddleware(
      'global-auth',
      defineNuxtRouteMiddleware(async to => {
        if (to.path === '/login' || to.path === '/confirm') return
        const user = await useSupabaseUser()
        if (!user) {
          console.log('no user, redirecting to login')
          const loginUrl = useRuntimeConfig().public.supabase.redirectOptions.login
          return navigateTo(loginUrl)
        }
      }),
      { global: true },
    )
  },
})
