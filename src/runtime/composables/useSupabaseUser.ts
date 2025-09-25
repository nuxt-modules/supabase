import type { JwtPayload } from '@supabase/supabase-js'
import { useState, type Ref } from '#imports'

/**
 * Reactive `User` state from Supabase. This is initialized in both client and server plugin
 * and, on the client, also updated through `onAuthStateChange` events.
 */
export const useSupabaseUser = (): Ref<JwtPayload | null> => useState<JwtPayload | null>('supabase_user', () => null)
