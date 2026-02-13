import { useState } from "#imports";
export const useSupabaseUser = () => useState("supabase_user", () => null);
