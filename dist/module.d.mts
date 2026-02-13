import * as _nuxt_schema from '@nuxt/schema';
import { CookieOptions } from 'nuxt/app';
import { SupabaseClientOptions } from '@supabase/supabase-js';

declare module '@nuxt/schema' {
    interface PublicRuntimeConfig {
        supabase: {
            url: string;
            key: string;
            redirect: boolean;
            redirectOptions: RedirectOptions;
            cookieName: string;
            cookiePrefix: string;
            useSsrCookies: boolean;
            cookieOptions: CookieOptions;
            types: string | false;
            clientOptions: SupabaseClientOptions<string>;
        };
    }
}
interface RedirectOptions {
    login: string;
    callback: string;
    include?: string[];
    exclude?: string[];
    /**
     * @deprecated Use `saveRedirectToCookie` instead.
     */
    cookieRedirect?: boolean;
    /**
     * If true, when automatically redirected the redirect path will be saved to a cookie, allowing retrieval later with the `useSupabaseRedirect` composable.
     * @default false
     */
    saveRedirectToCookie?: boolean;
}

interface ModuleOptions {
    /**
     * Supabase API URL
     * @default process.env.SUPABASE_URL
     * @example 'https://*.supabase.co'
     * @type string
     * @docs https://supabase.com/docs/reference/javascript/initializing#parameters
     */
    url: string;
    /**
     * Supabase Client publishable API Key (previously known as 'anon key')
     * @default process.env.SUPABASE_KEY
     * @example '123456789'
     * @type string
     * @docs https://supabase.com/docs/reference/javascript/initializing#parameters
     */
    key: string;
    /**
     * Supabase Legacy 'service_role' key (deprecated)
     * @default process.env.SUPABASE_SERVICE_KEY
     * @example '123456789'
     * @type string
     * @docs https://supabase.com/docs/reference/javascript/initializing#parameters
     * @deprecated Use `secretKey` instead. Will be removed in a future version.
     */
    serviceKey: string;
    /**
     * Supabase Secret key
     * @default process.env.SUPABASE_SECRET_KEY
     * @example '123456789'
     * @type string
     * @docs https://supabase.com/blog/jwt-signing-keys
     */
    secretKey: string;
    /**
     * Redirect automatically to login page if user is not authenticated
     * @default `true`
     * @type boolean
     */
    redirect?: boolean;
    /**
     * Redirection options, set routes for login and callback redirect
     * @default
     * {
        login: '/login',
        callback: '/confirm',
        exclude: [],
      }
     * @type RedirectOptions
     */
    redirectOptions?: RedirectOptions;
    /**
     * Cookie name used for storing the redirect path when using the `redirect` option, added in front of `-redirect-path` to form the full cookie name e.g. `sb-redirect-path`
     * @default 'sb'
     * @type string
     * @deprecated Use `cookiePrefix` instead.
     */
    cookieName?: string;
    /**
     * The prefix used for all supabase cookies, and the redirect cookie.
     * @default The default storage key from the supabase-js client.
     * @type string
     */
    cookiePrefix?: string;
    /**
     * If true, the supabase client will use cookies to store the session, allowing the session to be used from the server in ssr mode.
     * Some `clientOptions` are not configurable when this is enabled. See the docs for more details.
     *
     * If false, the server will not be able to access the session.
     * @default true
     * @type boolean
     */
    useSsrCookies?: boolean;
    /**
     * Cookie options
     * @default {
        maxAge: 60 * 60 * 8,
        sameSite: 'lax',
        secure: true,
      }
     * @type CookieOptions
     * @docs https://nuxt.com/docs/api/composables/use-cookie#options
     */
    cookieOptions?: CookieOptions;
    /**
     * Path to Supabase database type definitions file
     * @default '~/types/database.types.ts'
     * @type string
     */
    types?: string | false;
    /**
     * Supabase client options (overrides default options from `@supabase/ssr`)
     * @default { }
     * @type object
     * @docs https://supabase.com/docs/reference/javascript/initializing#parameters
     */
    clientOptions?: SupabaseClientOptions<string>;
}
declare const _default: _nuxt_schema.NuxtModule<ModuleOptions, ModuleOptions, false>;

export { _default as default };
export type { ModuleOptions, RedirectOptions };
