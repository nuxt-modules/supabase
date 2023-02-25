import { fileURLToPath } from 'url'
import { defu } from 'defu'
import { defineNuxtModule, addPlugin, addServerHandler, extendViteConfig, createResolver, resolveModule, addTemplate } from '@nuxt/kit'
import type { SupabaseClientOptions } from '@supabase/supabase-js'
import { CookieOptions, RedirectOptions } from './runtime/types'
export { useSupabaseAuthClient } from './runtime/composables/useSupabaseAuthClient'
export { useSupabaseClient } from './runtime/composables/useSupabaseClient'
export { useSupabaseToken } from './runtime/composables/useSupabaseToken'
export { useSupabaseUser } from './runtime/composables/useSupabaseUser'

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
   * Redirection options
   * @default false
   * @type object | boolean
   */
  redirect?: RedirectOptions | boolean

  /**
   * Supabase Client options
   * @default {}
   * @type object
   * @docs https://supabase.com/docs/reference/javascript/initializing#parameters
   */
  client?: SupabaseClientOptions<String>

  /**
   * Supabase Client options
   * @default {
      name: 'sb',
      lifetime: 60 * 60 * 8,
      domain: '',
      path: '/',
      sameSite: 'lax'
    }
   * @type object
   */
  cookies?: CookieOptions
  
  /**
   * Auto import necessary parts.
   * @default true
   * @type boolean
   */
  autoImport?: boolean
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: '@nuxtjs/supabase',
    configKey: 'supabase',
    compatibility: {
      nuxt: '^3.0.0-rc.8'
    }
  },
  defaults: {
    url: process.env.SUPABASE_URL as string,
    key: process.env.SUPABASE_KEY as string,
    serviceKey: process.env.SUPABASE_SERVICE_KEY as string,
    client: {},
    redirect: false,
    cookies: {
      name: 'sb',
      lifetime: 60 * 60 * 8,
      domain: '',
      path: '/',
      sameSite: 'lax'
    },
    autoImport: true
  },
  setup (options, nuxt) {
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

    // Public runtimeConfig
    nuxt.options.runtimeConfig.public.supabase = defu(nuxt.options.runtimeConfig.public.supabase, {
      url: options.url,
      key: options.key,
      client: options.client,
      redirect: options.redirect,
      cookies: options.cookies,
      autoImport: options.autoImport
    })

    // Private runtimeConfig
    nuxt.options.runtimeConfig.supabase = defu(nuxt.options.runtimeConfig.supabase, {
      serviceKey: options.serviceKey
    })

    // Transpile runtime
    const runtimeDir = fileURLToPath(new URL('./runtime', import.meta.url))
    nuxt.options.build.transpile.push(runtimeDir)

    // Transpile @supabase/ packages
    // TODO: Remove when packages fixed with valid ESM exports
    // https://github.com/nuxt-community/supabase-module/issues/54
    nuxt.options.build.transpile.push(
      '@supabase/functions-js',
      '@supabase/gotrue-js',
      '@supabase/postgrest-js',
      '@supabase/realtime-js',
      '@supabase/storage-js',
      '@supabase/supabase-js'
    )

    // Add supabase server plugin to load the user on server-side
    addPlugin(resolve(runtimeDir, 'plugins', 'supabase.server'))
    addPlugin(resolve(runtimeDir, 'plugins', 'supabase.client'))

    // Add route middleware plugin for redirect
    if (options.redirect) {
      addPlugin(resolve(runtimeDir, 'plugins', 'auth-redirect'))
    }

    // Add supabase session endpoint to store the session on server-side
    addServerHandler({
      route: '/api/_supabase/session',
      handler: resolve(runtimeDir, 'server/api/session')
    })

    // Add supabase composables
    if (options.autoImport) {
      nuxt.hook('imports:dirs', (dirs) => {
        dirs.push(resolve(runtimeDir, 'composables'))
      })
    }

    nuxt.hook('nitro:config', (nitroConfig) => {
      nitroConfig.alias = nitroConfig.alias || {}

      // Inline module runtime in Nitro bundle
      nitroConfig.externals = defu(typeof nitroConfig.externals === 'object' ? nitroConfig.externals : {}, {
        inline: [resolve('./runtime')]
      })
      nitroConfig.alias['#supabase/server'] = resolveRuntimeModule('./server/services')
    })

    addTemplate({
      filename: 'types/supabase.d.ts',
      getContents: () => [
        'declare module \'#supabase/server\' {',
        `  const serverSupabaseClient: typeof import('${resolve('./runtime/server/services')}').serverSupabaseClient`,
        `  const serverSupabaseServiceRole: typeof import('${resolve('./runtime/server/services')}').serverSupabaseServiceRole`,
        `  const serverSupabaseUser: typeof import('${resolve('./runtime/server/services')}').serverSupabaseUser`,
        '}'
      ].join('\n')
    })

    nuxt.hook('prepare:types', (options) => {
      options.references.push({ path: resolve(nuxt.options.buildDir, 'types/supabase.d.ts') })
    })

    // Optimize cross-fetch
    extendViteConfig((config) => {
      config.optimizeDeps = config.optimizeDeps || {}
      config.optimizeDeps.include = config.optimizeDeps.include || []
      config.optimizeDeps.include.push('cross-fetch')
    })

    if (nuxt.options.dev) {
      extendViteConfig((config) => {
        config.optimizeDeps = config.optimizeDeps || {}
        config.optimizeDeps.include = config.optimizeDeps.include || []
        config.optimizeDeps.include.push('websocket')
      })
      // Transpile websocket only for non dev environments
    } else if (!['cloudflare'].includes(process.env.NITRO_PRESET as string)) {
      nuxt.options.build.transpile.push('websocket')
    }
  }
})
