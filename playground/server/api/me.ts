import { serverSupabaseUser } from '#supabase/server'

export default defineEventHandler(async (event) => {
  return await serverSupabaseUser(event)
})
