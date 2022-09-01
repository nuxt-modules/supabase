import { useRuntimeConfig } from '#imports'

export const redirectToLogin = async (toPath) => {
  const redirect = useRuntimeConfig().public.supabase.redirect
  if (redirect && redirect.login) {
    if ([redirect.login, redirect.callback].includes(toPath)) {
      console.log('already on login :')
      return
    }
    console.log('navigate to :', redirect.login)
    return navigateTo(redirect.login)
  }
}
