export default defineNuxtConfig({
  extends: ['docus'],
  modules: ['@nuxtjs/plausible', '@vercel/analytics/nuxt', '@vercel/speed-insights/nuxt'],
  site: {
    name: 'Nuxt Supabase',
  },
})
