import { defineNuxtConfig } from 'nuxt'

// https://v3.nuxtjs.org/docs/directory-structure/nuxt.config
export default defineNuxtConfig({
  buildModules: [
    // https://github.com/nuxt-community/supabase-module
    '@nuxtjs/supabase',
    // UI lib (will be soon open sourced)
    '@nuxthq/ui',
    // https://github.com/nuxt-community/color-mode-module
    '@nuxtjs/color-mode'
  ],
  ui: {
    colors: {
      primary: 'green'
    }
  }
})
