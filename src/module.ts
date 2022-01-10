import defu from 'defu'
import { resolve } from 'pathe'
import { defineNuxtModule, addPlugin, addServerMiddleware } from '@nuxt/kit'
import type { Nuxt } from '@nuxt/schema'
import { SupabaseOptions } from './runtime/types'

export default defineNuxtModule<SupabaseOptions>({
  meta: {
    name: '@nuxtjs/supabase',
    configKey: 'supabase',
    compatibility: {
      nuxt: '^3.0.0',
      bridge: true
    }
  },
  defaults: {
    url: process.env.SUPABASE_URL as string,
    key: process.env.SUPABASE_KEY as string
  },
  setup (options: SupabaseOptions, nuxt: Nuxt) {
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
      key: options.key
    })

    // Transpile runtime
    const runtimeDir = resolve(__dirname, './runtime')
    nuxt.options.build.transpile.push(runtimeDir)

    // Add supabase server plugin to load the user on server-side
    addPlugin(resolve(runtimeDir, 'plugins/supabase.server'))
    addPlugin(resolve(runtimeDir, 'plugins/supabase.client'))

    // Add supabase session endpoint to store the session on server-side
    addServerMiddleware({
      path: '/api/_supabase/session',
      handler: resolve(runtimeDir, 'server/api/session')
    })

    // Add supabase composables
    nuxt.hook('autoImports:dirs', (dirs) => {
      dirs.push(resolve(runtimeDir, 'composables'))
    })

    // Make nuxt pointing to the CJS files
    // nuxt.options.alias['@supabase/supabase-js'] = '@supabase/supabase-js/dist/main'
    // nuxt.options.alias['@supabase/gotrue-js'] = '@supabase/gotrue-js/dist/main'
    // nuxt.options.alias['@supabase/realtime-js'] = '@supabase/realtime-js/dist/main'
    // nuxt.options.alias['@supabase/storage-js'] = '@supabase/storage-js/dist/main'
    // nuxt.options.alias['@supabase/postgrest-js'] = '@supabase/postgrest-js/dist/main'
  }
})

export * from './runtime/types'

declare module '@nuxt/schema' {
  interface ConfigSchema {
    publicRuntimeConfig?: {
      supabase?: SupabaseOptions
    }
  }
  interface NuxtConfig {
    supabase?: SupabaseOptions
  }
  interface NuxtOptions {
    supabase?: SupabaseOptions
  }
}
