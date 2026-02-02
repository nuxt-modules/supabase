import type { JwtPayload } from '@supabase/supabase-js';
import type { H3Event } from 'h3';
export declare const serverSupabaseUser: (event: H3Event) => Promise<JwtPayload | null>;
