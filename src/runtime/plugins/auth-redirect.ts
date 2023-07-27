import { useSupabaseUser } from '../composables/useSupabaseUser'
import { defineNuxtPlugin, addRouteMiddleware, useRuntimeConfig, navigateTo } from '#imports'

export default defineNuxtPlugin(() => {
  addRouteMiddleware(
    'global-auth',
    async to => {
      if (to.path === '/login' || to.path === '/confirm') return
      const user = await useSupabaseUser()
      if (!user && process.client) {
        console.log('no user, redirecting to login')
        const loginUrl = useRuntimeConfig().public.supabase.redirectOptions.login
        return navigateTo(loginUrl)
      }
    },
    { global: true },
  )
})
