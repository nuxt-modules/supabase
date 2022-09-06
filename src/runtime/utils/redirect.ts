import { useRuntimeConfig, navigateTo } from '#imports'

export const redirectToLogin = (toPath) => {
  const redirect = useRuntimeConfig().public.supabase.redirect
  if (redirect && redirect.login) {
    if ([redirect.login, redirect.callback].includes(toPath)) {
      return
    }

    return navigateTo(redirect.login)
  }
}
