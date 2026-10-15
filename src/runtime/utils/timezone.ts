export function withTimezoneHeader(headers: Record<string, string> | undefined, timezone: string): Record<string, string> | undefined {
  // 'browser' is resolved by the client plugin, the server can't know the viewer's zone.
  if (!timezone || timezone === 'browser') {
    return headers
  }

  // PostgREST reads `Prefer` as a comma-separated list, so append instead of overwriting.
  return { ...headers, Prefer: [headers?.Prefer, `timezone=${timezone}`].filter(Boolean).join(',') }
}
