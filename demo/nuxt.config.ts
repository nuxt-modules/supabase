export default defineNuxtConfig({
  modules: [
    // https://github.com/nuxt-modules/supabase
    "@nuxtjs/supabase",
     // https://github.com/nuxt/ui
     "@nuxt/ui",
    // https://github.com/nuxt-modules/color-mode
    "@nuxtjs/color-mode",
  ],

  runtimeConfig: {
    public: {
      baseUrl: process.env.BASE_URL || "http://localhost:3000",
    },
  },

  supabase: {
    redirectOptions: {
      login: "/",
      callback: "/confirm",
    },
  },

  compatibilityDate: "2024-09-01",
});
