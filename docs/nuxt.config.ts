export default defineNuxtConfig({
  extends: ['docus'],
  modules: ['@nuxtjs/plausible'],
  site: {
    name: 'Nuxt Supabase',
  },
  future: {
    compatibilityVersion: 4,
  },
})
