import type { User } from '@supabase/supabase-js'
import { useState } from '#imports'

/**
 * Reactive `User` state from Supabase, updated through `onAuthStateChange` events in the client plugin.
 */
export const useSupabaseUser = () => useState<User | null>('supabase_user', () => null)
