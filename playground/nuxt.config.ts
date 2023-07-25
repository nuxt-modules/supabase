export default defineNuxtConfig({
  modules: ['../src/module'],

  supabase: {
    cookies: {
      lifetime: 60 * 60 * 8, // 8 hours
    },
    redirect: {
      login: '/login',
      callback: '/confirm',
    },
  },
  // nitro: {
  //   routeRules: {
  //     '/login': { ssr: false },
  //     '/confirm': { ssr: false },
  //   },
  // },
})
