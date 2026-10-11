import { afterEach, describe, expect, it, vi } from 'vitest'
import { fetchWithRetry } from '../src/runtime/utils/fetch-retry'

describe('fetchWithRetry', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('does not log headers or body when all retries fail', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('network')))
    vi.spyOn(console, 'warn').mockImplementation(() => {})
    const error = vi.spyOn(console, 'error').mockImplementation(() => {})

    await expect(fetchWithRetry('https://example.supabase.co/auth/v1/token?grant_type=refresh_token', {
      method: 'POST',
      headers: { apikey: 'secret-key' },
      body: JSON.stringify({ refresh_token: 'secret-token' }),
    })).rejects.toThrow('network')

    expect(error).toHaveBeenCalledTimes(1)
    expect(error.mock.calls[0]![2]).toEqual({ method: 'POST' })
  })
})
