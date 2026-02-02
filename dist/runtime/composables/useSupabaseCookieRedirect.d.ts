import type { CookieRef } from 'nuxt/app';
export interface UseSupabaseCookieRedirectReturn {
    /**
     * The reactive value of the redirect path cookie.
     * Can be both read and written to.
     */
    path: CookieRef<string | null>;
    /**
     * Get the current redirect path cookie value, then clear it
     */
    pluck: () => string | null;
}
export declare const useSupabaseCookieRedirect: () => UseSupabaseCookieRedirectReturn;
