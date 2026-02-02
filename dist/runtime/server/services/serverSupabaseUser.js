import { createError } from "h3";
import { serverSupabaseClient } from "../services/serverSupabaseClient.js";
export const serverSupabaseUser = async (event) => {
  const client = await serverSupabaseClient(event);
  const { data, error } = await client.auth.getClaims();
  if (error) {
    throw createError({ statusMessage: error?.message });
  }
  return data?.claims ?? null;
};
