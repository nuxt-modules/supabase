import type { JwtPayload } from '@supabase/supabase-js'
import { useState, type Ref } from '#imports'

/**
 * Reactive `User` state from Supabase. This is populated by the JWT Payload from the auth.getClaims() call.
 */
export const useSupabaseUser = (): Ref<JwtPayload | null> => useState<JwtPayload | null>('supabase_user', () => null)
