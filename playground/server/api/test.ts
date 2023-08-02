import { createError } from 'h3'
import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'

export default defineEventHandler(async event => {
  const supabase = await serverSupabaseClient(event)
  const user = await serverSupabaseUser(event)
  if (!supabase) {
    throw createError({ statusMessage: 'Supabase client not found' })
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
