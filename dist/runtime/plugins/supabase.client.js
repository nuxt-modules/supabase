import { createBrowserClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { fetchWithRetry } from "../utils/fetch-retry.js";
import { useSupabaseSession } from "../composables/useSupabaseSession.js";
import { useSupabaseUser } from "../composables/useSupabaseUser.js";
import { defineNuxtPlugin, useRuntimeConfig, useNuxtApp } from "#imports";
export default defineNuxtPlugin({
  name: "supabase",
  enforce: "pre",
  async setup({ provide }) {
    const nuxtApp = useNuxtApp();
    const { url, key, cookieOptions, cookiePrefix, useSsrCookies, clientOptions } = useRuntimeConfig().public.supabase;
    let client;
    if (useSsrCookies) {
      client = createBrowserClient(url, key, {
        ...clientOptions,
        cookieOptions: {
          ...cookieOptions,
          name: cookiePrefix
        },
        isSingleton: true,
        global: {
          fetch: fetchWithRetry,
          ...clientOptions.global
        }
      });
    } else {
      client = createClient(url, key, {
        ...clientOptions,
        global: {
          fetch: fetchWithRetry,
          ...clientOptions.global
        }
      });
    }
    provide("supabase", { client });
    const currentSession = useSupabaseSession();
    const currentUser = useSupabaseUser();
    if (!useSsrCookies) {
      const { data } = await client.auth.getSession();
      if (data.session) {
        currentSession.value = data.session;
      }
    }
    nuxtApp.hook("page:start", async () => {
      const { data } = await client.auth.getClaims();
      currentUser.value = data?.claims ?? null;
    });
    client.auth.onAuthStateChange((_, session) => {
      if (JSON.stringify(currentSession.value) !== JSON.stringify(session)) {
        currentSession.value = session;
        if (session?.user) {
          client.auth.getClaims().then(({ data }) => {
            currentUser.value = data?.claims ?? null;
          });
        } else {
          currentUser.value = null;
        }
      }
    });
  }
});
