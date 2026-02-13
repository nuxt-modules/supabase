import { createError } from "h3";
import { serverSupabaseClient } from "../services/serverSupabaseClient.js";
export const serverSupabaseSession = async (event) => {
  const client = await serverSupabaseClient(event);
  const { data: { session }, error } = await client.auth.getSession();
  if (error) {
    throw createError({ statusMessage: error?.message });
  }
  delete session?.user;
  return session;
};
