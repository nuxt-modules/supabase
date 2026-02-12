export default defineNuxtConfig({
  modules: ["../src/module"],

  compatibilityDate: "2024-07-05",

  nitro: {
    routeRules: {
      "/clientonly": { ssr: false },
    },
    rollupConfig: {
      onwarn(warning, warn) {
        const isSupabaseUnusedImportWarning =
          warning.code === "UNUSED_EXTERNAL_IMPORT" &&
          (warning.exporter?.includes("@supabase/") ||
            warning.message.includes("@supabase/supabase-js/dist/index.mjs"));

        const isNitroCircularRuntimeWarning =
          warning.code === "CIRCULAR_DEPENDENCY" &&
          warning.message.includes("node_modules/.pnpm/nitropack");

        if (isSupabaseUnusedImportWarning || isNitroCircularRuntimeWarning) {
          return;
        }

        warn(warning);
      },
    },
  },

  vite: {
    build: {
      rollupOptions: {
        onwarn(warning, warn) {
          const isSupabaseUnusedImportWarning =
            warning.code === "UNUSED_EXTERNAL_IMPORT" &&
            (warning.exporter?.includes("@supabase/") ||
              warning.message.includes("@supabase/supabase-js/dist/index.mjs"));

          if (isSupabaseUnusedImportWarning) {
            return;
          }

          warn(warning);
        },
      },
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
