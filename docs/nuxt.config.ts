import { defineNuxtConfig } from 'nuxt'

export default defineNuxtConfig({
  modules: ['vue-plausible'],
  extends: ['./node_modules/@docus/docs-theme'],
  theme: {},
  // github: {
  //   owner: 'nuxt-community',
  //   repo: 'supabase-module',
  //   branch: 'main'
  // },
  plausible: {
    domain: 'supabase.nuxtjs.org'
  },
  tailwindcss: {
    config: {
      theme: {
        extend: {
          colors: {
            primary: {
              100: '#C2F0DB',
              200: '#A1E7C8',
              300: '#80DFB4',
              400: '#60D7A1',
              500: '#3FCF8E',
              600: '#2BAB71',
              700: '#207E54',
              800: '#145136',
              900: '#092418'
            }
          }
        }
      }
    }
  }
})
