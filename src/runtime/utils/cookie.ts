import { AuthChangeEvent, Session } from '@supabase/supabase-js'

export async function setSupabaseCookies(
    event: AuthChangeEvent,
    session: Session | null,

    //h3event: H3Event,
    useCookie: any | null,
    h3event: any | null,
) {
  // https://nuxt.com/docs/api/composables/use-cookie

  const config = useRuntimeConfig().public
  const cookieOptions = config.supabase.cookies

  if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
    console.info('not setServerSession create cookie', event)
    if (!session) { throw new Error('Auth session missing!') }

    setCookieClientServer(
      `${cookieOptions.name}-access-token`,
      session.access_token,
      {
        domain: cookieOptions.domain,
        maxAge: cookieOptions.lifetime ?? 0,
        path: cookieOptions.path,
        sameSite: cookieOptions.sameSite as boolean | 'lax' | 'strict' | 'none'
      },
      useCookie, h3event)

    setCookieClientServer(
      `${cookieOptions.name}-refresh-token`,
      session.refresh_token,
      {
        domain: cookieOptions.domain,
        maxAge: cookieOptions.lifetime ?? 0,
        path: cookieOptions.path,
        sameSite: cookieOptions.sameSite as boolean | 'lax' | 'strict' | 'none'
      },
      useCookie, h3event)
  }

  if (event === 'SIGNED_OUT') {
    console.info('not setServerSession clear cookie', event)

    setCookieClientServer(
      `${cookieOptions.name}-access-token`,
      '',
      {
        maxAge: -1,
        path: cookieOptions.path
      },
      useCookie, h3event)


    setCookieClientServer(
      `${cookieOptions.name}-refresh-token`,
      '',
      {
        maxAge: -1,
        path: cookieOptions.path
      },
      useCookie, h3event)
  }
}


export async function setCookieClientServer(
  name: string,
  value: string,

  options: any,

  useCookie: any | null,
  //h3event: H3Event,
  h3event: any | null,
  //event: AuthChangeEvent,
  //session: Session | null,
) {

  if (h3event == null) {
    // set cookie from client side 
    const cookie1 = useCookie(name, options)
    cookie1.value = value
  } else {
    // set cookie from server side
    assertMethod(h3event, 'POST')
    const body = await readBody(h3event)
    //const { h3event: event, session } = body
    setCookie(body.event, name, value, options)
  }


}