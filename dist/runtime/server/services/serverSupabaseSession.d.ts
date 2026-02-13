import type { Session } from '@supabase/supabase-js';
import type { H3Event } from 'h3';
export declare const serverSupabaseSession: (event: H3Event) => Promise<Omit<Session, "user"> | null>;
