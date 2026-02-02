import type { SupabaseClient } from '@supabase/supabase-js';
import type { H3Event } from 'h3';
import type { Database } from '#supabase/database';
export declare const serverSupabaseServiceRole: <T = Database>(event: H3Event) => SupabaseClient<T>;
