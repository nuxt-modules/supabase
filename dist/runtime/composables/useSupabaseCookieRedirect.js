import { useRuntimeConfig, useCookie } from "#imports";
export const useSupabaseCookieRedirect = () => {
  const config = useRuntimeConfig().public.supabase;
  const prefix = config.redirectOptions.saveRedirectToCookie ? config.cookiePrefix : config.cookieName;
  const cookie = useCookie(
    `${prefix}-redirect-path`,
    {
      ...config.cookieOptions,
      readonly: false
    }
  );
  return {
    path: cookie,
    pluck: () => {
      const value = cookie.value;
      cookie.value = null;
      return value;
    }
  };
};
