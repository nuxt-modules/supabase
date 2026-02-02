import { createServerClient, parseCookieHeader } from "@supabase/ssr";
import { getHeader } from "h3";
import { fetchWithRetry } from "../utils/fetch-retry.js";
import { setCookies } from "../utils/cookies.js";
import { serverSupabaseUser, serverSupabaseSession } from "../server/services/index.js";
import { useSupabaseSession } from "../composables/useSupabaseSession.js";
import { useSupabaseUser } from "../composables/useSupabaseUser.js";
import { defineNuxtPlugin, useRequestEvent, useRuntimeConfig } from "#imports";
export default defineNuxtPlugin({
  name: "supabase",
  enforce: "pre",
  async setup({ provide }) {
    const { url, key, cookiePrefix, useSsrCookies, cookieOptions, clientOptions } = useRuntimeConfig().public.supabase;
    const event = useRequestEvent();
    const client = createServerClient(url, key, {
      ...clientOptions,
      cookies: {
        getAll: () => parseCookieHeader(getHeader(event, "Cookie") ?? ""),
        setAll: (cookies) => setCookies(event, cookies)
      },
      cookieOptions: {
        ...cookieOptions,
        name: cookiePrefix
      },
      global: {
        fetch: fetchWithRetry,
        ...clientOptions.global
      }
    });
    provide("supabase", { client });
    if (useSsrCookies) {
      const [
        session,
        user
      ] = await Promise.all([
        serverSupabaseSession(event).catch(() => null),
        serverSupabaseUser(event).catch(() => null)
      ]);
      useSupabaseSession().value = session;
      useSupabaseUser().value = user;
    }
  }
});
