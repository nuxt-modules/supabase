export type SupabaseAuthProvider =
  | 'github'
  | 'facebook'
  | 'google'
  | 'cognito'
  | 'twitter'
  | 'discord'
  | 'twitch'
  | 'instagram'
  | 'vk'
  | 'linkedin'
  | 'reddit'
  | 'auth0'

export interface CookieOptions {
  /**
   *(Optional) The Cookie name prefix. Defaults to `sb` meaning the cookies will be `sb-access-token` and `sb-refresh-token`.
   */
  name?: string
  /**
   * (Optional) The cookie lifetime (expiration) in seconds. Set to 8 hours by default.
   */
  maxAge?: number
  /**
   * (Optional) By default, no domain is set, and most clients will consider the cookie to apply to only the current domain.
   */
  domain?: string
  /**
   * (Optional) By default, the path is considered the "default path".
   */
  path?: string
  /**
   * (Optional) SameSite configuration for the session cookie. Defaults to 'lax'
   * `true` will set the SameSite attribute to Strict for strict same site enforcement.
   * `false` will not set the SameSite attribute.
   * 'lax' will set the SameSite attribute to Lax for lax same site enforcement.
   * 'strict' will set the SameSite attribute to Strict for strict same site enforcement.
   * 'none' will set the SameSite attribute to None for an explicit cross-site cookie.
   * @default 'lax'
   * @type boolean | 'lax' | 'strict' | 'none'
   */
  sameSite?: 'lax' | 'strict' | 'none' | boolean
  /**
   * When truthy, the Secure attribute is set, otherwise it is not. By default, the Secure attribute is not set.
   *Note: be careful when setting this to true, as compliant clients will not send the cookie back to the server in the future if the browser does not have an HTTPS connection.
   * @default true
   * @type boolean
   */
  secure?: boolean
}

export interface RedirectOptions {
  login: string
  callback: string
}
