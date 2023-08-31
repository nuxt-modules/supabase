import { fileURLToPath } from 'url'
import { defu } from 'defu'
import { execa } from 'execa'
import { defineNuxtModule, addPlugin, createResolver, addTemplate, resolveModule, extendViteConfig } from '@nuxt/kit'
import { CookieOptions } from 'nuxt/app'
import { RedirectOptions } from './runtime/types'
import { SupabaseClientOptions } from '@supabase/supabase-js'

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
   * Supabase Project ID
   * @default process.env.SUPABASE_PROJECT_ID
   * @type string
   */
  projectId?: string

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

  /**
   * Generate database types for supabase services
   * @default boolean
   * @type boolean
   */
  generateTypes: boolean
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: '@nuxtjs/supabase',
    configKey: 'supabase',
    compatibility: {
      nuxt: '^3.0.0',
    },
  },
  defaults: {
    url: process.env.SUPABASE_URL as string,
    key: process.env.SUPABASE_KEY as string,
    serviceKey: process.env.SUPABASE_SERVICE_KEY as string,
    projectId: process.env.SUPABASE_PROJECT_ID as string,
    redirect: true,
    redirectOptions: {
      login: '/login',
      callback: '/confirm',
      exclude: [],
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
    generateTypes: false,
  },
  setup(options, nuxt) {
    const { resolve } = createResolver(import.meta.url)
    const resolveRuntimeModule = (path: string) => resolveModule(path, { paths: resolve('./runtime') })

    // Make sure url and key are set
    if (!options.url) {
      // eslint-disable-next-line no-console
      console.warn('Missing `SUPABASE_URL` in `.env`')
    }
    if (!options.key) {
      // eslint-disable-next-line no-console
      console.warn('Missing `SUPABASE_KEY` in `.env`')
    }
    if (options.generateTypes && !options.projectId) {
      console.warn('Cannot generate types missing `SUPABASE_PROJECT_ID` in `.env`')
    }

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

    // ensure callback URL is not using SSR
    if (options.redirect && options.redirectOptions.callback) {
      // && options.redirectOptions.login) {
      const routeRules: { [key: string]: any } = {}
      routeRules[options.redirectOptions.callback] = { ssr: false }
      //routeRules[options.redirectOptions.login] = { ssr: false }
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

    //Add route middleware plugin for redirect
    if (options.redirect) {
      addPlugin(resolve(runtimeDir, 'plugins', 'auth-redirect'))
    }

    // Add supabase composables
    nuxt.hook('imports:dirs', dirs => {
      dirs.push(resolve(runtimeDir, 'composables'))
    })

    nuxt.hook('nitro:config', nitroConfig => {
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
          "declare module '#supabase/server' {",
          `  const serverSupabaseClient: typeof import('${resolve('./runtime/server/services')}').serverSupabaseClient`,
          `  const serverSupabaseServiceRole: typeof import('${resolve(
            './runtime/server/services',
          )}').serverSupabaseServiceRole`,
          `  const serverSupabaseUser: typeof import('${resolve('./runtime/server/services')}').serverSupabaseUser`,
          '}',
        ].join('\n'),
    })

    let hasDatabaseTypes = false
    if (options.generateTypes && options.projectId) {
      hasDatabaseTypes = true
      addTemplate({
        filename: 'types/supabase.database-gen.d.ts',
        getContents: async () => {
          const { stdout } = await execa('npx', ['supabase', 'gen', 'types', 'typescript', '--project-id', options.projectId]).catch(() => {
            console.error("Error generating types for supabase")
            return { stdout: undefined }
          })

          if (!stdout) {
            return ""
          }

          return `${stdout}\n\nexport type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
          \nexport type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T]`
        },
      })
    }

    nuxt.hook('prepare:types', options => {
      options.references.push({ path: resolve(nuxt.options.buildDir, 'types/supabase.d.ts') })
      if (hasDatabaseTypes) {
        options.references.push({ path: resolve(nuxt.options.buildDir, 'types/supabase.database-gen.d.ts') })
      }
    })

    // Transpile websocket only for non dev environments (except cloudflare)
    if (!nuxt.options.dev && !['cloudflare'].includes(process.env.NITRO_PRESET as string)) {
      nuxt.options.build.transpile.push('websocket')
    }

    // Optimize @supabase/ packages for dev
    // TODO: Remove when packages fixed with valid ESM exports
    // https://github.com/supabase/gotrue/issues/1013
    extendViteConfig(config => {
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
