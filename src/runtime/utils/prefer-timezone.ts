/**
 * Add `timezone=<zone>` to `Prefer` without dropping a preference the caller already set there.
 * PostgREST reads `Prefer` as one comma-separated list.
 */
export const preferTimezone = (
  timezone: string,
  headers: Record<string, string> | undefined,
): Record<string, string> => ({
  ...headers,
  Prefer: [headers?.Prefer, `timezone=${timezone}`].filter(Boolean).join(','),
})
