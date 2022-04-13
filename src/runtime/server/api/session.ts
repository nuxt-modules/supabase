import { useBody, setCookie, assertMethod, defineEventHandler } from 'h3'
import { useRuntimeConfig } from '#nitro'

const config = useRuntimeConfig().public

export default defineEventHandler(async (event) => {
  assertMethod(event, 'POST')
  const body = await useBody(event)
  const cookieOptions = config.supabase.cookies

  const { event: signEvent, session } = body

  if (!event) { throw new Error('Auth event missing!') }

  if (signEvent === 'SIGNED_IN') {
    if (!session) { throw new Error('Auth session missing!') }
    setCookie(
      event,
      `${cookieOptions.name}-access-token`,
      session.access_token,
      {
        domain: cookieOptions.domain,
        maxAge: cookieOptions.lifetime ?? 0,
        path: cookieOptions.path,
        sameSite: cookieOptions.sameSite
      }
    )
  }

  if (signEvent === 'SIGNED_OUT') {
    setCookie(
      event,
      `${cookieOptions.name}-access-token`,
      '',
      {
        maxAge: -1,
        path: cookieOptions.path
      }
    )
  }

  return 'auth cookie set'
})
