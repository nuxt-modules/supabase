import { createError } from 'h3'
import { serverSupabaseClient, serverSupabaseUser, serverSupabaseSession } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const supabase = await serverSupabaseClient(event)

  if (!supabase) {
    throw createError({ statusMessage: 'Supabase client not found' })
  }

  const user = await serverSupabaseUser(event)
  if (!user) {
    throw createError({ statusCode: 404, statusMessage: 'User not found' })
  }

  const session = await serverSupabaseSession(event)
  if (!session) {
    throw createError({ statusCode: 401, statusMessage: 'Session not found' })
  }

  // const { data, error } = await supabase.from('test').select('*')
  const { data, error } = await supabase.from('pushupers')
    .select('firstname, lastname, avatar, email')
    .eq('email', user.email)
    .single()

  if (error) {
    throw createError({ statusMessage: error.message })
  }

  return data
})
