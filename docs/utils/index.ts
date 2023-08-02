/**
 * Format a date with `en` locale to enforce a consistent format.
 */
export const formatDateByLocale = (d: string | number | Date, options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' }) => {
  return new Date(d).toLocaleDateString('en', options)
}
