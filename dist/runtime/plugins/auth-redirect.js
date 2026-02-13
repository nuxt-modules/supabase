import { useSupabaseCookieRedirect } from "../composables/useSupabaseCookieRedirect.js";
import { useSupabaseSession } from "../composables/useSupabaseSession.js";
import { defineNuxtPlugin, addRouteMiddleware, defineNuxtRouteMiddleware, useRuntimeConfig, navigateTo } from "#imports";
function matchesAnyPattern(path, patterns) {
  return patterns.some((pattern) => {
    if (!pattern) return false;
    const regex = new RegExp(`^${pattern.replace(/\*/g, ".*")}$`);
    return regex.test(path);
  });
}
export default defineNuxtPlugin({
  name: "auth-redirect",
  setup() {
    addRouteMiddleware(
      "global-auth",
      defineNuxtRouteMiddleware((to) => {
        const config = useRuntimeConfig().public.supabase;
        const { login, callback, include, exclude, cookieRedirect, saveRedirectToCookie } = config.redirectOptions;
        if (include && include.length > 0) {
          if (!matchesAnyPattern(to.path, include)) {
            return;
          }
        }
        const excludePatterns = [login, callback, ...exclude ?? []];
        if (matchesAnyPattern(to.path, excludePatterns)) {
          return;
        }
        const session = useSupabaseSession();
        if (!session.value) {
          if (cookieRedirect || saveRedirectToCookie) {
            const redirectInfo = useSupabaseCookieRedirect();
            redirectInfo.path.value = to.fullPath;
          }
          return navigateTo(login);
        }
      }),
      { global: true }
    );
  }
});
