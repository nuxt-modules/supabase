import { fileURLToPath } from 'node:url';
import fs from 'node:fs';
import { defu } from 'defu';
import { relative } from 'pathe';
import { defineNuxtModule, useLogger, createResolver, addPlugin, addImportsDir, addTemplate, extendViteConfig } from '@nuxt/kit';

const module = defineNuxtModule({
  meta: {
    name: "@nuxtjs/supabase",
    configKey: "supabase",
    compatibility: {
      nuxt: ">=3.0.0"
    }
  },
  defaults: {
    url: process.env.SUPABASE_URL,
    key: process.env.SUPABASE_KEY,
    serviceKey: process.env.SUPABASE_SERVICE_KEY,
    secretKey: process.env.SUPABASE_SECRET_KEY,
    redirect: true,
    redirectOptions: {
      login: "/login",
      callback: "/confirm",
      exclude: [],
      cookieRedirect: false,
      saveRedirectToCookie: false
    },
    cookieName: "sb",
    cookiePrefix: void 0,
    useSsrCookies: true,
    cookieOptions: {
      maxAge: 60 * 60 * 8,
      sameSite: "lax",
      secure: true
    },
    types: "~/types/database.types.ts",
    clientOptions: {}
  },
  setup(options, nuxt) {
    const logger = useLogger("@nuxt/supabase");
    const { resolve, resolvePath } = createResolver(import.meta.url);
    nuxt.options.runtimeConfig.public.supabase = defu(nuxt.options.runtimeConfig.public.supabase, {
      url: options.url,
      key: options.key,
      redirect: options.redirect,
      redirectOptions: options.redirectOptions,
      cookieName: options.cookieName,
      cookiePrefix: options.cookiePrefix,
      useSsrCookies: options.useSsrCookies,
      cookieOptions: options.cookieOptions,
      clientOptions: options.clientOptions
    });
    nuxt.options.runtimeConfig.supabase = defu(nuxt.options.runtimeConfig.supabase || {}, {
      serviceKey: options.serviceKey,
      secretKey: options.secretKey
    });
    const finalUrl = nuxt.options.runtimeConfig.public.supabase.url;
    if (!finalUrl) {
      logger.warn("Missing supabase url, set it either in `nuxt.config.ts` or via env variable");
    } else {
      try {
        const defaultStorageKey = `sb-${new URL(finalUrl).hostname.split(".")[0]}-auth-token`;
        const currentPrefix = nuxt.options.runtimeConfig.public.supabase.cookiePrefix;
        nuxt.options.runtimeConfig.public.supabase.cookiePrefix = currentPrefix || defaultStorageKey;
      } catch (error) {
        logger.error(
          `Invalid Supabase URL: "${finalUrl}". Please provide a valid URL (e.g., https://example.supabase.co or http://localhost:5432)`,
          error
        );
        const currentPrefix = nuxt.options.runtimeConfig.public.supabase.cookiePrefix;
        nuxt.options.runtimeConfig.public.supabase.cookiePrefix = currentPrefix || "sb-auth-token";
        if (!nuxt.options.dev) {
          throw new Error("Invalid Supabase URL configuration");
        }
      }
    }
    if (!nuxt.options.runtimeConfig.public.supabase.key) {
      logger.warn("Missing supabase publishable key, set it either in `nuxt.config.ts` or via env variable");
    }
    if (nuxt.options.runtimeConfig.public.supabase.redirectOptions.cookieRedirect) {
      logger.warn("The `cookieRedirect` option is deprecated, use `saveRedirectToCookie` instead.");
    }
    if (nuxt.options.runtimeConfig.public.supabase.cookieName != "sb") {
      logger.warn("The `cookieName` option is deprecated, use `cookiePrefix` instead.");
    }
    const supabaseConfig = nuxt.options.runtimeConfig.supabase;
    const hasServiceKey = !!supabaseConfig?.serviceKey;
    const hasSecretKey = !!supabaseConfig?.secretKey;
    if (hasServiceKey && !hasSecretKey) {
      logger.warn("`SUPABASE_SERVICE_KEY` is deprecated and will be removed in a future version. Please migrate to `SUPABASE_SECRET_KEY` (JWT signing key). See: https://supabase.com/blog/jwt-signing-keys");
    }
    const mergedOptions = nuxt.options.runtimeConfig.public.supabase;
    if (mergedOptions.redirect && mergedOptions.redirectOptions.callback) {
      const routeRules = {};
      routeRules[mergedOptions.redirectOptions.callback] = { ssr: false };
      nuxt.options.nitro = defu(nuxt.options.nitro, {
        routeRules
      });
    }
    const runtimeDir = fileURLToPath(new URL("./runtime", import.meta.url));
    nuxt.options.build.transpile.push(runtimeDir);
    addPlugin(resolve(runtimeDir, "plugins", "supabase.client"));
    addPlugin(resolve(runtimeDir, "plugins", "supabase.server"));
    if (mergedOptions.redirect) {
      addPlugin(resolve(runtimeDir, "plugins", "auth-redirect"));
    }
    addImportsDir(resolve("./runtime/composables"));
    nuxt.hook("nitro:config", (nitroConfig) => {
      nitroConfig.alias = nitroConfig.alias || {};
      nitroConfig.externals = defu(typeof nitroConfig.externals === "object" ? nitroConfig.externals : {}, {
        inline: [resolve("./runtime"), "@supabase/supabase-js"]
      });
      nitroConfig.alias["#supabase/server"] = resolve("./runtime/server/services");
      nitroConfig.alias["#supabase/database"] = resolve(nitroConfig.buildDir, "types/supabase-database");
    });
    addTemplate({
      filename: "types/supabase.d.ts",
      getContents: () => [
        "declare module '#supabase/server' {",
        `  const serverSupabaseClient: typeof import('${resolve("./runtime/server/services")}').serverSupabaseClient`,
        `  const serverSupabaseServiceRole: typeof import('${resolve(
          "./runtime/server/services"
        )}').serverSupabaseServiceRole`,
        `  const serverSupabaseUser: typeof import('${resolve("./runtime/server/services")}').serverSupabaseUser`,
        `  const serverSupabaseSession: typeof import('${resolve("./runtime/server/services")}').serverSupabaseSession`,
        "}"
      ].join("\n")
    });
    addTemplate({
      filename: "types/supabase-database.d.ts",
      getContents: async () => {
        if (options.types) {
          try {
            const path = await resolvePath(options.types);
            const typesPath = await resolvePath("~~/.nuxt/types/");
            if (fs.existsSync(path)) {
              return `export * from '${relative(typesPath, path)}'`;
            } else {
              logger.warn(
                `Database types configured at "${options.types}" but file not found at "${path}". Using "Database = unknown".`
              );
            }
          } catch (error) {
            logger.error(`Failed to load Supabase database types from "${options.types}":`, error);
          }
        }
        return `export type Database = unknown`;
      }
    });
    nuxt.hook("prepare:types", async (options2) => {
      options2.references.push({ path: resolve(nuxt.options.buildDir, "types/supabase.d.ts") });
    });
    if (!nuxt.options.dev && !["cloudflare"].includes(process.env.NITRO_PRESET)) {
      nuxt.options.build.transpile.push("websocket");
    }
    extendViteConfig((config) => {
      config.optimizeDeps = config.optimizeDeps || {};
      config.optimizeDeps.include = config.optimizeDeps.include || [];
      config.optimizeDeps.include.push("@nuxtjs/supabase > cookie", "@nuxtjs/supabase > @supabase/postgrest-js", "@supabase/supabase-js");
    });
  }
});

export { module as default };
