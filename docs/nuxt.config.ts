// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  extends: ['@nuxt/ui-pro'],
  modules: [
    '@nuxt/content',
    '@nuxt/ui',
    '@nuxtjs/fontaine',
    '@nuxtjs/google-fonts',
    'nuxt-og-image',
    '@nuxtlabs/github-module',
    '@nuxtjs/plausible',
  ],
  ui: {
    icons: ['heroicons', 'simple-icons'],
  },
  // Fonts
  fontMetrics: {
    fonts: ['DM Sans'],
  },
  googleFonts: {
    display: 'swap',
    download: true,
    families: {
      'DM+Sans': [400, 500, 600, 700],
    },
  },
  nitro: {
    prerender: {
      routes: [
        '/api/search.json',
      ],
    },
  },
  // Essential for OgImage on `nuxt generate`
  // https://github.com/harlan-zw/nuxt-og-image/blob/c89fd4e29f56eeb00b12bc0d7e4bcb82ab459cae/src/module.ts#L127C16-L127C16
  site: {
    url: 'https://nuxt-ui-pro-template-docs.vercel.app',
  },
  // Devtools / Typescript
  devtools: { enabled: true },
  typescript: { strict: false },
  github: {
    repo: 'nuxt-modules/supabase',
  },
})
