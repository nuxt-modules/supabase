import { defineDocusConfig } from 'docus'

export default defineDocusConfig({
  title: '@nuxtjs/supabase',
  url: 'https://supabase.nuxtjs.org',
  theme: '@docus/docs-theme',
  template: 'docs',
  twitter: '@nuxt_js',
  github: {
    repo: 'nuxt-community/supabase-module',
    branch: 'main',
    releases: true
  }
})
