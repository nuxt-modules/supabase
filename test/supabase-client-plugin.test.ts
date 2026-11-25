import { beforeEach, describe, expect, it, vi } from 'vitest'

const state = new Map<string, { value: unknown }>()
const auth = {
  getSession: vi.fn(),
  getClaims: vi.fn(),
  onAuthStateChange: vi.fn(),
}

vi.mock('#imports', () => ({
  defineNuxtPlugin: (plugin: unknown) => plugin,
  useNuxtApp: () => ({ hook: vi.fn() }),
  useRuntimeConfig: () => ({
    public: {
      supabase: {
        url: 'https://example.supabase.co',
        key: 'anon-key',
        cookieOptions: {},
        cookiePrefix: 'sb',
        useSsrCookies: false,
        clientOptions: {},
        timezone: '',
      },
    },
  }),
  useState: (key: string, init: () => unknown) => {
    if (!state.has(key)) {
      state.set(key, { value: init() })
    }
    return state.get(key)
  },
}))

vi.mock('@supabase/supabase-js', () => ({
  createClient: () => ({ auth }),
}))

const session = (accessToken: string) => ({
  access_token: accessToken,
  refresh_token: `refresh-${accessToken}`,
  expires_at: 1,
  user: { id: 'user-1' },
})

describe('supabase client plugin', () => {
  beforeEach(() => {
    state.clear()
    vi.clearAllMocks()
    auth.getSession.mockResolvedValue({ data: { session: null } })
    auth.getClaims.mockResolvedValue({ data: { claims: { sub: 'user-1' } } })
  })

  it('does not fetch claims again when the session of the same user is refreshed', async () => {
    const { default: plugin } = await import('../src/runtime/plugins/supabase.client')
    await (plugin as unknown as { setup: (app: unknown) => Promise<void> }).setup({ provide: vi.fn() })
    const onAuthStateChange = auth.onAuthStateChange.mock.calls[0]![0]

    onAuthStateChange('SIGNED_IN', session('a'))
    await vi.waitFor(() => expect(state.get('supabase_user')!.value).toEqual({ sub: 'user-1' }))
    expect(auth.getClaims).toHaveBeenCalledTimes(1)

    onAuthStateChange('TOKEN_REFRESHED', session('b'))
    onAuthStateChange('TOKEN_REFRESHED', session('c'))
    await new Promise(resolve => setTimeout(resolve, 0))

    expect(state.get('supabase_session')!.value).toMatchObject({ access_token: 'c' })
    expect(state.get('supabase_user')!.value).toEqual({ sub: 'user-1' })
    expect(auth.getClaims).toHaveBeenCalledTimes(1)
  })

  it('fetches claims when another user signs in', async () => {
    const { default: plugin } = await import('../src/runtime/plugins/supabase.client')
    await (plugin as unknown as { setup: (app: unknown) => Promise<void> }).setup({ provide: vi.fn() })
    const onAuthStateChange = auth.onAuthStateChange.mock.calls[0]![0]

    onAuthStateChange('SIGNED_IN', session('a'))
    await vi.waitFor(() => expect(state.get('supabase_user')!.value).toEqual({ sub: 'user-1' }))

    auth.getClaims.mockResolvedValue({ data: { claims: { sub: 'user-2' } } })
    onAuthStateChange('SIGNED_IN', { ...session('b'), user: { id: 'user-2' } })
    await vi.waitFor(() => expect(state.get('supabase_user')!.value).toEqual({ sub: 'user-2' }))
    expect(auth.getClaims).toHaveBeenCalledTimes(2)

    onAuthStateChange('SIGNED_OUT', null)
    expect(state.get('supabase_user')!.value).toBeNull()
  })
})
