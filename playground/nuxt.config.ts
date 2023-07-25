export default defineNuxtConfig({
  modules: ['../src/module'],

  supabase: {
    // cookieOptions: {
    //   name: 'stefan',
    //   maxAge: 60 * 60,
    //   sameSite: 'strict',
    //   secure: false,
    // },
  },
})
