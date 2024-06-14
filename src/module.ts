import { fileURLToPath } from 'node:url'
import { defu } from 'defu'
import { defineNuxtModule, addPlugin, createResolver, addTemplate, resolveModule, extendViteConfig } from '@nuxt/kit'
import type { CookieOptions } from 'nuxt/app'
import type { SupabaseClientOptions } from '@supabase/supabase-js'
import type { NitroConfig } from 'nitropack'
import type { RedirectOptions } from './runtime/types'

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
   * Cookie name, used for storing access and refresh tokens, added in front of `-access-token` and `-refresh-token` to form the full cookie name e.g. `sb-access-token`
   * @default 'sb'
   * @type string
   */
  cookieName?: string

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
   * Supabase Client options
   * @default {
      auth: {
        flowType: 'pkce',
        detectSessionInUrl: true,
        persistSession: true,
      },
    }
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
    },
    cookieName: 'sb',
    cookieOptions: {
      maxAge: 60 * 60 * 8,
      sameSite: 'lax',
      secure: true,
    } as CookieOptions,
    clientOptions: {
      auth: {
        flowType: 'pkce',
        detectSessionInUrl: true,
        persistSession: true,
        autoRefreshToken: true,
      },
    } as SupabaseClientOptions<string>,
  },
  setup(options, nuxt) {
    const { resolve } = createResolver(import.meta.url)
    const resolveRuntimeModule = (path: string) => resolveModule(path, { paths: resolve('./runtime') })

    // Public runtimeConfig
    nuxt.options.runtimeConfig.public.supabase = defu(nuxt.options.runtimeConfig.public.supabase, {
      url: options.url,
      key: options.key,
      redirect: options.redirect,
      redirectOptions: options.redirectOptions,
      cookieName: options.cookieName,
      cookieOptions: options.cookieOptions,
      clientOptions: options.clientOptions,
    })

    // Private runtimeConfig
    nuxt.options.runtimeConfig.supabase = defu(nuxt.options.runtimeConfig.supabase, {
      serviceKey: options.serviceKey,
    })

    // Make sure url and key are set
    if (!nuxt.options.runtimeConfig.public.supabase.url) {
      console.warn('Missing supabase url, set it either in `nuxt.config.js` or via env variable')
    }
    if (!nuxt.options.runtimeConfig.public.supabase.key) {
      console.warn('Missing supabase anon key, set it either in `nuxt.config.js` or via env variable')
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
      nitroConfig.alias['#supabase/server'] = resolveRuntimeModule('./server/services')
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

    nuxt.hook('prepare:types', (options) => {
      options.references.push({ path: resolve(nuxt.options.buildDir, 'types/supabase.d.ts') })
    })

    // Transpile websocket only for non dev environments (except cloudflare)
    if (!nuxt.options.dev && !['cloudflare'].includes(process.env.NITRO_PRESET as string)) {
      nuxt.options.build.transpile.push('websocket')
    }

    // Optimize @supabase/ packages for dev
    // TODO: Remove when packages fixed with valid ESM exports
    // https://github.com/supabase/gotrue/issues/1013
    extendViteConfig((config) => {
      config.optimizeDeps = config.optimizeDeps || {}
      config.optimizeDeps.include = config.optimizeDeps.include || []
      config.optimizeDeps.exclude = config.optimizeDeps.exclude || []
      config.optimizeDeps.include.push(
        '@supabase/functions-js',
        '@supabase/gotrue-js',
        '@supabase/postgrest-js',
        '@supabase/realtime-js',
        '@supabase/storage-js',
        '@supabase/supabase-js',
      )
    })
  },
})
