import { useNuxtApp } from "#imports";
export const useSupabaseClient = () => {
  return useNuxtApp().$supabase.client;
};
