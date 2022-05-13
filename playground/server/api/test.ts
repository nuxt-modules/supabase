// import { serverSupabaseClient } from '../../../src/runtime/server/services/serverSupabaseClient'
import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const client = serverSupabaseClient(event)

  const res = await client.from('pushupers').select()

  return res.data
})
