export default defineNuxtConfig({
  modules: ['../src/module'],

  supabase: {
    // cookieOptions: {
    //   name: 'test',
    //   maxAge: 60 * 60,
    //   sameSite: 'strict',
    //   secure: false,
    // },
    // clientOptions: {
    //   auth: {
    //     flowType: 'implicit',
    //   },
    // },
    // redirect: true,
    redirectOptions: {
      login: '/login',
      callback: '/confirm',
      exclude: ['/unprotected', '/public/*']
    },
  },
})
