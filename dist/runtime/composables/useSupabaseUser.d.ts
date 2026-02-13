import type { JwtPayload } from '@supabase/supabase-js';
import { type Ref } from '#imports';
/**
 * Reactive `User` state from Supabase. This is populated by the JWT Payload from the auth.getClaims() call.
 */
export declare const useSupabaseUser: () => Ref<JwtPayload | null>;
