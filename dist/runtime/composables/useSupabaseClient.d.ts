import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '#build/types/supabase-database';
export declare const useSupabaseClient: <T = Database>() => SupabaseClient<T>;
