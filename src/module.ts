import { fileURLToPath } from 'url'
import defu from 'defu'
import { resolve } from 'pathe'
import { defineNuxtModule, addPlugin, addServerMiddleware } from '@nuxt/kit'
import { CookieOptions, SupabaseClientOptions } from '@supabase/supabase-js'

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
   * Supabase API key
   * @default process.env.SUPABASE_KEY
   * @example '123456789'
   * @type string
   * @docs https://supabase.com/docs/reference/javascript/initializing#parameters
   */
  key: string

  /**
   * Supabase Client options
   * @default {}
   * @type object
   * @docs https://supabase.com/docs/reference/javascript/initializing#parameters
   */
  client?: SupabaseClientOptions

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
   * @docs https://supabase.com/docs/reference/javascript/initializing#parameters
   */
  cookies?: CookieOptions
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: '@nuxtjs/supabase',
    configKey: 'supabase',
    compatibility: {
      nuxt: '^3.0.0 || ^2.16.0',
      bridge: true
    }
  },
  defaults: {
    url: process.env.SUPABASE_URL as string,
    key: process.env.SUPABASE_KEY as string,
    client: {},
    cookies: {
      name: 'sb',
      lifetime: 60 * 60 * 8,
      domain: '',
      path: '/',
      sameSite: 'lax'
    }
  },
  setup (options, nuxt) {
    // Make sure url and key are set
    if (!options.url) {
      throw new Error('Missing `SUPABASE_URL` in `.env`')
    }
    if (!options.key) {
      throw new Error('Missing `SUPABASE_KEY` in `.env`')
    }

    // Default runtimeConfig
    nuxt.options.publicRuntimeConfig.supabase = defu(nuxt.options.publicRuntimeConfig.supabase, {
      url: options.url,
      key: options.key,
      client: options.client,
      cookies: options.cookies
    })

    // Transpile runtime
    const runtimeDir = fileURLToPath(new URL('./runtime', import.meta.url))
    nuxt.options.build.transpile.push(runtimeDir)

    // Add supabase server plugin to load the user on server-side
    addPlugin(resolve(runtimeDir, 'plugins', 'supabase.server'))
    addPlugin(resolve(runtimeDir, 'plugins', 'supabase.client'))

    // Add supabase session endpoint to store the session on server-side
    addServerMiddleware({
      path: '/api/_supabase/session',
      handler: resolve(runtimeDir, 'server/api/session')
    })

    // Add supabase composables
    nuxt.hook('autoImports:dirs', (dirs) => {
      dirs.push(resolve(runtimeDir, 'composables'))
    })

    nuxt.options.vite = {
      optimizeDeps: {
        include: ['@supabase/supabase-js']
      }
    }
  }
})
