import { useCookies } from 'h3'
import { useSupabaseUser } from '../composables/useSupabaseUser'
import { useSupabaseClient } from '../composables/useSupabaseClient'
import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin(async (nuxtApp) => {
  const user = useSupabaseUser()
  const client = useSupabaseClient()

  const req = nuxtApp.ssrContext!.req

  // Supabase needs to read from req.cookies
  req.cookies = useCookies(req)

  // Fix SSR called to RLS protected tables
  // https://github.com/supabase/supabase/issues/1735#issuecomment-922284089
  // @ts-ignore
  client.auth.session = () => ({
    access_token: req.cookies['sb:token']
  })

  // Check authenticated user during SSR
  user.value = (await client.auth.api.getUserByCookie(req)).user
})
