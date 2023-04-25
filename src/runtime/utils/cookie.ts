import { AuthChangeEvent, Session } from '@supabase/supabase-js'

/*
Set Supabase Cookies
Since we can set cookie from server or client
we also pass the proper method :
* useCookie : to set cookie from client side
* h3event : to set cookie from server side (with setCookie)
*/
export async function setSupabaseCookies(
  event: AuthChangeEvent,
  session: Session | null,

  useCookie: any | null,
  h3event: any | null,
) {
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

/*
This function will set a cookie from a client OR server side.
The name/value/options are obvious (same as in useCookie or setCookie).
The useCookie/h3event args are passed to determine the client or server side :
* useCookie is passed from client side calls (h3event will be null in that case)
* h3event is passed from server side calls (useCookie will be null in that case)
This *trick* is weird and I failed to find a proper ans single way to set cookie :-/
*/
export async function setCookieClientServer(
  name: string,
  value: string,
  //TODO: what is options type ?
  options: any,
  //TODO: what is useCookie type ?
  useCookie: any | null,
  //TODO: what is h3event type ? (H3Event is not working)
  h3event: any | null,
) {
  if (h3event == null) {
    // set cookie from client side 
    // https://nuxt.com/docs/api/composables/use-cookie
    const cookie1 = useCookie(name, options)
    cookie1.value = value
  } else {
    // set cookie from server side
    //assertMethod(h3event, 'POST')
    const body = await readBody(h3event)
    setCookie(h3event, name, value, options)
  }
}