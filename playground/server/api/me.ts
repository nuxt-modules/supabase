import { createError } from 'h3'
import { serverSupabaseUser, serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event)
  const client = serverSupabaseClient(event)

  const { data, error } = await client.from('pushupers')
    .select('firstname, lastname, avatar, email')
    .eq('email', user.email)
    .single()

  if (error) {
    throw createError({ statusMessage: error.message })
  }

  return data
})
