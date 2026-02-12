export default defineNuxtConfig({
  modules: ["../src/module"],

  compatibilityDate: "2024-07-05",

  nitro: {
    routeRules: {
      "/clientonly": { ssr: false },
    },
  },

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
      login: "/login",
      callback: "/confirm",
      // include: ['/protected'],
      exclude: ["/unprotected", "/public/*"],
    },
  },
});
