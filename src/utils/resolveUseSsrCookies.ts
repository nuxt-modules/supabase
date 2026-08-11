export function resolveUseSsrCookies(useSsrCookies: boolean | undefined, ssr: boolean) {
  return useSsrCookies ?? ssr !== false
}
