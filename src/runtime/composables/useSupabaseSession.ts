import type { Session } from '@supabase/supabase-js'
import { useState } from '#imports'

/**
 * Reactive `Session` state from Supabase. This is initialized in both client and server plugin
 * and, on the client, also updated through `onAuthStateChange` events.
 */
export const useSupabaseSession = () => useState<Session | null>('supabase_session', () => null)
