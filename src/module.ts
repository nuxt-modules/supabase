import { fileURLToPath } from 'url'
import { defu } from 'defu'
import { defineNuxtModule, addPlugin, extendViteConfig, createResolver } from '@nuxt/kit'
import type { SupabaseClientOptions } from '@supabase/supabase-js'
import { CookieOptions, RedirectOptions } from './runtime/types'

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
   * @default
   * {
      login: '/login',
      callback: '/confirm',
    }
   * @type RedirectOptions | boolean
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
   * Cookies options
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
    client: {
      auth: {
        detectSessionInUrl: true,
        persistSession: true,
        autoRefreshToken: true,
      },
    },
    redirect: {
      login: '/login',
      callback: '/confirm',
    },
    cookies: {
      name: 'sb',
      lifetime: 60 * 60 * 8,
      domain: '',
      path: '/',
      sameSite: 'lax',
    },
  },
  setup(options, nuxt) {
    const { resolve } = createResolver(import.meta.url)

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
    })

    // Private runtimeConfig
    nuxt.options.runtimeConfig.supabase = defu(nuxt.options.runtimeConfig.supabase, {
      serviceKey: options.serviceKey,
    })

    // ensure callback and login URL are not using SSR
    if (typeof options.redirect === 'object' && options.redirect.callback && options.redirect.login) {
      const routeRules: { [key: string]: any } = {}
      routeRules[options.redirect.callback] = { ssr: false }
      routeRules[options.redirect.login] = { ssr: false }
      nuxt.options.nitro = defu(nuxt.options.nitro, {
        routeRules,
      })
    }

    // Transpile runtime
    const runtimeDir = fileURLToPath(new URL('./runtime', import.meta.url))
    nuxt.options.build.transpile.push(runtimeDir)

    // Add supabase plugins on server and client
    addPlugin(resolve(runtimeDir, 'plugins', 'supabase.server'))
    addPlugin(resolve(runtimeDir, 'plugins', 'supabase.client'))

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
      // nitroConfig.alias['#supabase/server'] = resolveRuntimeModule('./server/services')
    })

    nuxt.hook('prepare:types', options => {
      options.references.push({ path: resolve(nuxt.options.buildDir, 'types/supabase.d.ts') })
    })

    // Transpile @supabase/go-true package only on client side
    // TODO: Remove when packages fixed with valid ESM exports
    // https://github.com/nuxt-community/supabase-module/issues/54
    nuxt.options.build.transpile.push(({ isServer }) => !isServer && '@supabase/gotrue-js')

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
