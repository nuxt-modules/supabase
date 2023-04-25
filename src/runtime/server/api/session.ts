import { readBody, setCookie, assertMethod, defineEventHandler } from 'h3'
import { useRuntimeConfig } from '#imports'
import { setSupabaseCookies } from '../../utils/cookie'

const config = useRuntimeConfig().public

export default defineEventHandler(async (event) => {
  assertMethod(event, 'POST')
  const body = await readBody(event)
  const { event: signEvent, session } = body

  if (!event) { throw new Error('Auth event missing!') }

  await setSupabaseCookies(
    signEvent,
    session,
    null,   // no useCookie since we are on server side
    event,  // pass the H3Event since we are on server side
  )
  return 'auth cookie set'
})
