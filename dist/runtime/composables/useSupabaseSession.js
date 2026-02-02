import { useState } from "#imports";
export const useSupabaseSession = () => useState("supabase_session", () => null);
