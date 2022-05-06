import { serverSupabaseClient } from '../../../src/runtime/server/services/serverSupabaseClient'

export default eventHandler(async (event) => {
  const client = serverSupabaseClient(event)

  const { data } = await client.from('pushupers').select()

  return data
})
