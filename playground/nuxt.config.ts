export default defineNuxtConfig({
  modules: [
    '../src/module'
  ],
  myModule: {
    addPlugin: true
  },
  supabase: {
    cookies: {
      lifetime: 60 * 60 * 8 // 8 hours
    },
    redirect: {
      login: '/',
      callback: '/confirm'
    }
  }
})
