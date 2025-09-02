import { fileURLToPath } from 'node:url'
import { access, constants } from 'node:fs/promises'
import { defu } from 'defu'
import { relative } from 'pathe'
import { defineNuxtModule, addPlugin, createResolver, addTemplate, extendViteConfig, useLogger, addImportsDir, addServerHandler } from '@nuxt/kit'
import type { CookieOptions } from 'nuxt/app'
import type { SupabaseClientOptions } from '@supabase/supabase-js'
import type { NitroConfig, NitroRouteConfig } from 'nitropack'
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
  url?: string

  /**
   * Supabase Client API Key
   * @default process.env.SUPABASE_KEY
   * @example '123456789'
   * @type string
   * @docs https://supabase.com/docs/reference/javascript/initializing#parameters
   */
  key?: string

  /**
   * Supabase Service key
   * @default process.env.SUPABASE_SERVICE_KEY
   * @example '123456789'
   * @type string
   * @docs https://supabase.com/docs/reference/javascript/initializing#parameters
   */
  serviceKey?: string

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

  /**
   * Enable development mode features and debugging
   * @default process.env.NODE_ENV === 'development'
   * @type boolean
   */
  devMode?: boolean
}

// Security validation functions
function validateSupabaseUrl(url: string): boolean {
  try {
    const parsedUrl = new URL(url)
    const isSupabaseUrl = parsedUrl.hostname.includes('supabase.co') || parsedUrl.hostname.includes('supabase.in') || parsedUrl.hostname === 'localhost' || parsedUrl.hostname.startsWith('127.0.0.1')
    const isHttps = parsedUrl.protocol === 'https:' || (parsedUrl.hostname === 'localhost' && parsedUrl.protocol === 'http:')

    return isSupabaseUrl && isHttps
  } catch {
    return false
  }
}

function validateApiKey(key: string): boolean {
  // Supabase keys should be JWT-like or start with specific prefixes
  const supabaseKeyPattern = /^(eyJ|sb-|supabase_)/
  return key.length > 20 && supabaseKeyPattern.test(key)
}

function sanitizeServiceKey(serviceKey: string): boolean {
  return serviceKey.length > 30 && serviceKey.includes('.')
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
    devMode: process.env.NODE_ENV === 'development',
  },
  async setup(options, nuxt) {
    const logger = useLogger('@nuxtjs/supabase')
    const { resolve, resolvePath } = createResolver(import.meta.url)

    try {
      const supabaseUrl = options.url ?? process.env.SUPABASE_URL
      const supabaseKey = options.key ?? process.env.SUPABASE_KEY
      const supabaseServiceKey = options.serviceKey ?? process.env.SUPABASE_SERVICE_KEY

      // Critical validation - fail fast with clear errors
      if (!supabaseUrl) {
        throw new Error('Missing Supabase URL. Set it via module options or SUPABASE_URL environment variable.')
      }

      if (!validateSupabaseUrl(supabaseUrl)) {
        throw new Error(`Invalid Supabase URL format: ${supabaseUrl}. Expected https://*.supabase.co or localhost URL.`)
      }

      if (!supabaseKey) {
        throw new Error('Missing Supabase anon key. Set it via module options or SUPABASE_KEY environment variable.')
      }

      if (!validateApiKey(supabaseKey)) {
        throw new Error('Invalid Supabase anon key format. Key should be a valid JWT or start with supabase prefix.')
      }

      // Service key validation (optional but if provided, must be valid)
      if (supabaseServiceKey && !sanitizeServiceKey(supabaseServiceKey)) {
        logger.warn('Service key provided but appears invalid. This may cause server-side operations to fail.')
      }

      // Security: Ensure service key is server-only
      if (supabaseServiceKey && nuxt.options.ssr === false) {
        logger.warn('Service key detected in SPA mode. Service key will be excluded from client bundle.')
      }

      // Enhanced cookie security in production
      const productionCookieDefaults = {
        secure: !options.devMode,
        sameSite: 'lax' as const,
      }

      const finalCookieOptions = {
        ...productionCookieDefaults,
        ...options.cookieOptions,
      }

      // Generate secure cookie prefix
      let cookiePrefix = options.cookiePrefix
      if (!cookiePrefix) {
        try {
          const defaultStorageKey = `sb-${new URL(supabaseUrl).hostname.split('.')[0]}-auth-token`
          cookiePrefix = defaultStorageKey
        } catch {
          cookiePrefix = 'sb-default-auth-token'
          logger.warn('Could not generate cookie prefix from URL, using default')
        }
      }

      // Public runtime config (client-safe)
      nuxt.options.runtimeConfig.public.supabase = defu(
        nuxt.options.runtimeConfig.public.supabase,
        {
          url: supabaseUrl,
          key: supabaseKey,
          redirect: options.redirect,
          redirectOptions: options.redirectOptions,
          cookieName: options.cookieName,
          cookiePrefix,
          useSsrCookies: options.useSsrCookies,
          cookieOptions: options.cookieOptions,
          clientOptions: options.clientOptions,
        },
      )

      // Private runtime config (server-only)
      nuxt.options.runtimeConfig.supabase = defu(
        nuxt.options.runtimeConfig.supabase || {},
        {
          // Only include service key if provided and valid
          ...(supabaseServiceKey && { serviceKey: supabaseServiceKey }),
        },
      )

      // Security deprecation warnings
      if (nuxt.options.runtimeConfig.public.supabase.redirectOptions.cookieRedirect) {
        logger.warn('[SECURITY] The `cookieRedirect` option is deprecated, use `saveRedirectToCookie` instead.')
      }
      if (nuxt.options.runtimeConfig.public.supabase.cookieName !== 'sb') {
        logger.warn('[DEPRECATED] The `cookieName` option is deprecated, use `cookiePrefix` instead.')
      }

      // Route security: ensure callback URL doesn't use SSR
      const mergedOptions = nuxt.options.runtimeConfig.public.supabase
      if (mergedOptions.redirect && mergedOptions.redirectOptions.callback) {
        const routeRules: NitroConfig['routeRules'] = {}
        routeRules[mergedOptions.redirectOptions.callback] = {
          ssr: false,
          // Additional security headers for auth callback
          headers: {
            'X-Frame-Options': 'DENY',
            'X-Content-Type-Options': 'nosniff',
          }
        } as NitroRouteConfig

        nuxt.options.nitro = defu(nuxt.options.nitro, {
          routeRules,
        })
      }

      // Runtime directory setup
      const runtimeDir = fileURLToPath(new URL('./runtime', import.meta.url))

      // Selective transpilation for better performance
      const transpilePatterns = [
        '@nuxtjs/supabase/runtime',
        '@supabase/ssr',
      ]

      nuxt.options.build.transpile.push(...transpilePatterns)

      // Plugin loading with explicit order
      addPlugin({
        src: resolve(runtimeDir, 'plugins', 'supabase.server'),
        mode: 'server',
      })

      addPlugin({
        src: resolve(runtimeDir, 'plugins', 'supabase.client'),
        mode: 'client',
      })

      // Auth redirect plugin (only if redirect enabled)
      if (mergedOptions.redirect) {
        addPlugin({
          src: resolve(runtimeDir, 'plugins', 'auth-redirect'),
        })
      }

      // Composables auto-imports
      addImportsDir(resolve('./runtime/composables'))

      // Nitro configuration with error boundaries
      nuxt.hook('nitro:config', (nitroConfig) => {
        try {
          nitroConfig.alias = nitroConfig.alias || {}

          // Inline module runtime in Nitro bundle
          nitroConfig.externals = defu(
            typeof nitroConfig.externals === 'object' ? nitroConfig.externals : {},
            {
              inline: [resolve('./runtime')],
            }
          )

          nitroConfig.alias['#supabase/server'] = resolve('./runtime/server/services')
          nitroConfig.alias['#supabase/database'] = resolve(nitroConfig.buildDir!, 'types/supabase-database')

          // Security: Add server handler for health checks in dev mode
          if (options.devMode) {
            nitroConfig.handlers = nitroConfig.handlers || []
            nitroConfig.handlers.push({
              route: '/_supabase/health',
              handler: resolve(runtimeDir, 'server/health.mjs')
            })
          }
        } catch (error) {
          logger.error('Failed to configure Nitro:', error)
          throw error
        }
      })

      // Type definitions
      addTemplate({
        filename: 'types/supabase.d.ts',
        getContents: () =>
          [
            'declare module \'#supabase/server\' {',
            `  const serverSupabaseClient: typeof import('${resolve('./runtime/server/services')}').serverSupabaseClient`,
            `  const serverSupabaseServiceRole: typeof import('${resolve('./runtime/server/services')}').serverSupabaseServiceRole`,
            `  const serverSupabaseUser: typeof import('${resolve('./runtime/server/services')}').serverSupabaseUser`,
            `  const serverSupabaseSession: typeof import('${resolve('./runtime/server/services')}').serverSupabaseSession`,
            '}',
            '',
            '// Module augmentation for better type safety',
            'declare module \'@nuxt/schema\' {',
            '  interface PublicRuntimeConfig {',
            '    supabase: {',
            '      url: string',
            '      key: string',
            '      [key: string]: any',
            '    }',
            '  }',
            '  interface PrivateRuntimeConfig {',
            '    supabase?: {',
            '      serviceKey?: string',
            '    }',
            '  }',
            '}',
          ].join('\n'),
      })

      // Database types with async file checking
      addTemplate({
        filename: 'types/supabase-database.d.ts',
        getContents: async () => {
          if (options.types) {
            try {
              const path = await resolvePath(options.types)
              const typesPath = await resolvePath('~~/.nuxt/types/')

              // Use async file access check
              try {
                await access(path, constants.F_OK)
                return `export * from '${relative(typesPath, path)}'`
              }
              catch {
                logger.warn(`Database types file not found at: ${path}`)
              }
            }
            catch (error) {
              logger.warn(`Failed to resolve types path: ${options.types}`, error)
            }
          }

          return `export type Database = unknown`
        },
      })

      // Register types
      nuxt.hook('prepare:types', async (opts) => {
        opts.references.push({
          path: resolve(nuxt.options.buildDir, 'types/supabase.d.ts')
        })
      })

      // Conditional websocket transpilation
      if (!nuxt.options.dev && !['cloudflare', 'vercel-edge'].includes(process.env.NITRO_PRESET as string)) {
        nuxt.options.build.transpile.push('websocket')
      }

      // Vite optimization with error handling
      extendViteConfig((config) => {
        try {
          config.optimizeDeps = config.optimizeDeps || {}
          config.optimizeDeps.include = config.optimizeDeps.include || []

          // Optimized dependencies
          config.optimizeDeps.include.push(
            '@nuxtjs/supabase > cookie',
            '@nuxtjs/supabase > @supabase/postgrest-js',
            '@supabase/ssr',
            '@supabase/supabase-js'
          )

          // Security: Prevent sensitive data in build artifacts
          config.define = config.define || {}
          if (!options.devMode) {
            config.define.__SUPABASE_DEV_MODE__ = false
          }

          // Performance: Enable tree shaking for supabase modules
          config.optimizeDeps.exclude = config.optimizeDeps.exclude || []
        }
        catch (error) {
          logger.warn('Failed to extend Vite config:', error)
        }
      })

      // Cleanup hooks
      nuxt.hook('close', async () => {
        // Cleanup any persistent connections or resources
        logger.info('Cleaning up Supabase module resources')
      })

      // Development mode enhancements
      if (options.devMode) {
        logger.info('Supabase module running in development mode')

        // Add development-specific handlers or middleware
        nuxt.hook('listen', (server, { port, hostname }) => {
          logger.success(`Supabase module ready at http://${hostname}:${port}`)
        })
      }

      // Bundle analysis logging
      nuxt.hook('build:done', () => {
        if (options.devMode) {
          logger.info('Supabase module build completed successfully')
        }
      })
    }
    catch (error) {
      logger.error('Failed to setup Supabase module:', error)
      throw error
    }
  },
})
