import { setCookie, type H3Event } from 'h3'
import type { CookieOptions } from '#app'

export function setCookies(
  event: H3Event,
  cookies: {
    name: string
    value: string
    options: CookieOptions
  }[],
) {
  const response = event.node.res
  const headersWritable = () => !response.headersSent && !response.writableEnded

  if (!headersWritable()) {
    return
  }

  for (const { name, value, options } of cookies) {
    if (!headersWritable()) {
      break
    }
    setCookie(event, name, value, options)
  }
}
