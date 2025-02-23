import { fileURLToPath } from 'node:url'
import fs from 'node:fs'
import { defu } from 'defu'
import { defineNuxtModule, addPlugin, createResolver, addTemplate, extendViteConfig, useLogger } from '@nuxt/kit'
import type { CookieOptions } from 'nuxt/app'
import type { SupabaseClientOptions } from '@supabase/supabase-js'
import type { NitroConfig } from 'nitropack'
import type { RedirectOptions } from './types'

export * from './types'

export interface ModuleOptions {
  /**
   * Supabase API URL
   * @default process.env.SUPABASE_URL
   * @example 'https://*.supabase.co'
   * @type string
   * @docs https://supabase.com/docs/reference/javascript/initializing#parameters
   */
  url: string

  /**
   * Supabase Client API Key
   * @default process.env.SUPABASE_KEY
   * @example '123456789'
   * @type string
   * @docs https://supabase.com/docs/reference/javascript/initializing#parameters
   */
  key: string

  /**
   * Supabase Service key
   * @default process.env.SUPABASE_SERVICE_KEY
   * @example '123456789'
   * @type string
   * @docs https://supabase.com/docs/reference/javascript/initializing#parameters
   */
  serviceKey: string

  /**
   * Redirect automatically to login page if user is not authenticated
   * @default `true`
   * @type boolean
   */
  redirect?: boolean

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
  redirectOptions?: RedirectOptions

  /**
   * Cookie name used for storing the redirect path when using the `redirect` option, added in front of `-redirect-path` to form the full cookie name e.g. `sb-redirect-path`
   * @default 'sb'
   * @type string
   * @deprecated Use `cookiePrefix` instead.
   */
  cookieName?: string

  /**
   * The prefix used for all supabase cookies, and the redirect cookie.
   * @default The default storage key from the supabase-js client.
   * @type string
   */
  cookiePrefix?: string

  /**
   * If true, the supabase client will use cookies to store the session, allowing the session to be used from the server in ssr mode.
   * Some `clientOptions` are not configurable when this is enabled. See the docs for more details.
   *
   * If false, the server will not be able to access the session.
   * @default true
   * @type boolean
   */
  useSsrCookies?: boolean

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
  cookieOptions?: CookieOptions

  /**
   * Path to Supabase database type definitions file
   * @default '~/types/database.types.ts'
   * @type string
   */
  types?: string | false

  /**
   * Supabase client options (overrides default options from `@supabase/ssr`)
   * @default { }
   * @type object
   * @docs https://supabase.com/docs/reference/javascript/initializing#parameters
   */
  clientOptions?: SupabaseClientOptions<string>
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: '@nuxtjs/supabase',
    configKey: 'supabase',
    compatibility: {
      nuxt: '>=3.0.0',
    },
  },
  defaults: {
    url: process.env.SUPABASE_URL as string,
    key: process.env.SUPABASE_KEY as string,
    serviceKey: process.env.SUPABASE_SERVICE_KEY as string,
    redirect: true,
    redirectOptions: {
      login: '/login',
      callback: '/confirm',
      exclude: [],
      cookieRedirect: false,
      saveRedirectToCookie: false,
    },
    cookieName: 'sb',
    cookiePrefix: undefined,
    useSsrCookies: true,
    cookieOptions: {
      maxAge: 60 * 60 * 8,
      sameSite: 'lax',
      secure: true,
    } as CookieOptions,
    types: '~/types/database.types.ts',
    clientOptions: {} as SupabaseClientOptions<string>,
  },
  setup(options, nuxt) {
    const logger = useLogger('@nuxt/supabase')
    const { resolve, resolvePath } = createResolver(import.meta.url)

    // Public runtimeConfig
    nuxt.options.runtimeConfig.public.supabase = defu(nuxt.options.runtimeConfig.public.supabase, {
      url: options.url,
      key: options.key,
      redirect: options.redirect,
      redirectOptions: options.redirectOptions,
      cookieName: options.cookieName,
      cookiePrefix: options.cookiePrefix,
      useSsrCookies: options.useSsrCookies,
      cookieOptions: options.cookieOptions,
      clientOptions: options.clientOptions,
    })

    // Private runtimeConfig
    nuxt.options.runtimeConfig.supabase = defu(nuxt.options.runtimeConfig.supabase, {
      serviceKey: options.serviceKey,
    })

    const finalUrl = nuxt.options.runtimeConfig.public.supabase.url

    // Warn if the url isn't set.
    if (!finalUrl) {
      logger.warn('Missing supabase url, set it either in `nuxt.config.js` or via env variable')
    }
    else {
      // Use the default storage key as defined by the supabase-js client if no cookiePrefix is set.
      // Source: https://github.com/supabase/supabase-js/blob/3316f2426d7c2e5babaab7ddc17c30bfa189f500/src/SupabaseClient.ts#L86
      const defaultStorageKey = `sb-${new URL(finalUrl).hostname.split('.')[0]}-auth-token`
      const currentPrefix = nuxt.options.runtimeConfig.public.supabase.cookiePrefix
      nuxt.options.runtimeConfig.public.supabase.cookiePrefix = currentPrefix || defaultStorageKey
    }

    // Warn if the key isn't set.
    if (!nuxt.options.runtimeConfig.public.supabase.key) {
      logger.warn('Missing supabase anon key, set it either in `nuxt.config.js` or via env variable')
    }

    // Warn for deprecated features.
    if (nuxt.options.runtimeConfig.public.supabase.redirectOptions.cookieRedirect) {
      logger.warn('The `cookieRedirect` option is deprecated, use `saveRedirectToCookie` instead.')
    }
    if (nuxt.options.runtimeConfig.public.supabase.cookieName != 'sb') {
      logger.warn('The `cookieName` option is deprecated, use `cookiePrefix` instead.')
    }

    // ensure callback URL is not using SSR
    const mergedOptions = nuxt.options.runtimeConfig.public.supabase
    if (mergedOptions.redirect && mergedOptions.redirectOptions.callback) {
      const routeRules: NitroConfig['routeRules'] = {}
      routeRules[mergedOptions.redirectOptions.callback] = { ssr: false }
      nuxt.options.nitro = defu(nuxt.options.nitro, {
        routeRules,
      })
    }

    // Transpile runtime
    const runtimeDir = fileURLToPath(new URL('./runtime', import.meta.url))
    nuxt.options.build.transpile.push(runtimeDir)

    // Add supabase plugins on server and client
    addPlugin(resolve(runtimeDir, 'plugins', 'supabase.client'))
    addPlugin(resolve(runtimeDir, 'plugins', 'supabase.server'))

    // Add route middleware plugin for redirect
    if (mergedOptions.redirect) {
      addPlugin(resolve(runtimeDir, 'plugins', 'auth-redirect'))
    }

    // Add supabase composables
    nuxt.hook('imports:dirs', (dirs) => {
      dirs.push(resolve(runtimeDir, 'composables'))
    })

    nuxt.hook('nitro:config', (nitroConfig) => {
      nitroConfig.alias = nitroConfig.alias || {}

      // Inline module runtime in Nitro bundle
      nitroConfig.externals = defu(typeof nitroConfig.externals === 'object' ? nitroConfig.externals : {}, {
        inline: [resolve('./runtime')],
      })
      nitroConfig.alias['#supabase/server'] = resolve('./runtime/server/services')
      nitroConfig.alias['#supabase/database'] = resolve(nitroConfig.buildDir!, 'types/supabase-database')
    })

    addTemplate({
      filename: 'types/supabase.d.ts',
      getContents: () =>
        [
          'declare module \'#supabase/server\' {',
          `  const serverSupabaseClient: typeof import('${resolve('./runtime/server/services')}').serverSupabaseClient`,
          `  const serverSupabaseServiceRole: typeof import('${resolve(
            './runtime/server/services',
          )}').serverSupabaseServiceRole`,
          `  const serverSupabaseUser: typeof import('${resolve('./runtime/server/services')}').serverSupabaseUser`,
          `  const serverSupabaseSession: typeof import('${resolve('./runtime/server/services')}').serverSupabaseSession`,
          '}',
        ].join('\n'),
    })

    addTemplate({
      filename: 'types/supabase-database.d.ts',
      getContents: async () => {
        if (options.types) {
          // resolvePath is used to minify user input error.
          const path = await resolvePath(options.types)
          const basePath = await resolvePath('~~') // ~~ should be the base path in a nuxt project.

          if (fs.existsSync(path)) {
            // we are replacing the basePath with ../.. to move back to the root (~~) directory.
            return `export * from '${path.replace(basePath, '../..')}'`
          }
        }

        return `export type Database = unknown`
      },
    })

    nuxt.hook('prepare:types', async (options) => {
      options.references.push({ path: resolve(nuxt.options.buildDir, 'types/supabase.d.ts') })
    })

    // Transpile websocket only for non dev environments (except cloudflare)
    if (!nuxt.options.dev && !['cloudflare'].includes(process.env.NITRO_PRESET as string)) {
      nuxt.options.build.transpile.push('websocket')
    }

    // Needed to fix https://github.com/supabase/auth-helpers/issues/725
    extendViteConfig((config) => {
      config.optimizeDeps = config.optimizeDeps || {}
      config.optimizeDeps.include = config.optimizeDeps.include || []
      config.optimizeDeps.include.push('@nuxtjs/supabase > cookie', '@nuxtjs/supabase > @supabase/postgrest-js')
    })
  },
})
