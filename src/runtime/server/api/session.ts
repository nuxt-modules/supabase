import type { IncomingMessage, ServerResponse } from 'http'
import { useBody, setCookie, assertMethod } from 'h3'
import { useRuntimeConfig } from '#nitro'

const config = useRuntimeConfig().public

export default async (req: IncomingMessage, res: ServerResponse) => {
  assertMethod(req, 'POST')
  const body = await useBody(req)
  const cookieOptions = config.supabase.cookies

  const { event, session } = body

  if (!event) { throw new Error('Auth event missing!') }

  if (event === 'SIGNED_IN') {
    if (!session) { throw new Error('Auth session missing!') }
    setCookie(
      res,
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

  if (event === 'SIGNED_OUT') {
    setCookie(
      res,
      `${cookieOptions.name}-access-token`,
      '',
      {
        maxAge: -1,
        path: cookieOptions.path
      }
    )
  }

  return 'auth cookie set'
}
