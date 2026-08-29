import { describe, expect, it } from 'vitest'
import { resolveUseSsrCookies } from '../src/utils/resolveUseSsrCookies'

describe('resolveUseSsrCookies', () => {
  it('defaults to true when Nuxt SSR is enabled', () => {
    expect(resolveUseSsrCookies(undefined, true)).toBe(true)
  })

  it('defaults to false when Nuxt SSR is disabled', () => {
    expect(resolveUseSsrCookies(undefined, false)).toBe(false)
  })

  it('preserves explicit configuration', () => {
    expect(resolveUseSsrCookies(true, false)).toBe(true)
    expect(resolveUseSsrCookies(false, true)).toBe(false)
  })
})
