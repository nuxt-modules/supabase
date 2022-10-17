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
    // (Optional) The Cookie name prefix. Defaults to `sb` meaning the cookies will be `sb-access-token` and `sb-refresh-token`.
    name?: string
    // (Optional) The cookie lifetime (expiration) in seconds. Set to 8 hours by default.
    lifetime?: number
    // (Optional) The cookie domain this should run on. Leave it blank to restrict it to your domain.
    domain?: string
    path?: string
    // (Optional) SameSite configuration for the session cookie. Defaults to 'lax', but can be changed to 'strict' or 'none'. Set it to false if you want to disable the SameSite setting.
    sameSite?: string
  }

  export interface RedirectOptions {
    login: string
    callback: string
  }
