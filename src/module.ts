import defu from 'defu'
import { resolve } from 'pathe'
import { defineNuxtModule, addPlugin, addServerMiddleware } from '@nuxt/kit'
import type { Nuxt } from '@nuxt/schema'
import { SupabaseOptions } from './types'

export default defineNuxtModule<SupabaseOptions>({
  name: '@nuxtjs/supabase',
  configKey: 'supabase',
  setup (_options: SupabaseOptions, nuxt: Nuxt) {
    // Default runtimeConfig
    const supabaseConfig = nuxt.options.publicRuntimeConfig.supabase = defu(nuxt.options.publicRuntimeConfig.supabase, {
      url: process.env.SUPABASE_URL,
      key: process.env.SUPABASE_KEY
    })

    // Make sure url and key areset
    if (!supabaseConfig.url) {
      throw new Error('Missing `SUPABASE_URL` in `.env`')
    }
    if (!supabaseConfig.key) {
      throw new Error('Missing `SUPABASE_KEY` in `.env`')
    }

    // Add supabase server plugin to load the user on server-side
    addPlugin(resolve(__dirname, './plugins/supabase.server'))
    addPlugin(resolve(__dirname, './plugins/supabase.client'))

    // Add supabase session endpoint to store the session on server-side
    addServerMiddleware({
      path: '/api/_supabase/session',
      handler: resolve(__dirname, './server/api/session')
    })

    // Add supabase composables
    nuxt.hook('autoImports:dirs', (dirs) => {
      dirs.push(resolve(__dirname, './composables'))
    })

    // Add supabase to build transpile
    nuxt.options.build.transpile.push(
      '@supabase/supabase-js/dist/module',
      '@supabase/gotrue-js/dist/module',
      '@supabase/realtime-js/dist/module',
      '@supabase/storage-js/dist/module',
      '@supabase/postgrest-js/dist/module'
    )
  }
})

export * from './types'

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
