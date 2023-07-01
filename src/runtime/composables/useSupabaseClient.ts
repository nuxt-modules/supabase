import { SupabaseClient } from '@supabase/supabase-js'
import { useNuxtApp } from '#imports'
import { createSupabaseClient } from '../utils/client'
import { useSupabaseToken } from '../composables/useSupabaseToken'
import { GenericSchema } from '@supabase/supabase-js/dist/module/lib/types'

export const useSupabaseClient = <
  Database,
  SchemaName extends string & keyof Database = 'public' extends keyof Database
  ? 'public'
  : string & keyof Database,
  Schema extends GenericSchema = Database[SchemaName] extends GenericSchema
  ? Database[SchemaName]
  : any>(): SupabaseClient<Database, SchemaName, Schema> => {
  const nuxtApp = useNuxtApp()
  const token = useSupabaseToken()
  const Authorization = token.value ? `Bearer ${token.value}` : undefined

  // Recreate client if token has changed
  const recreateClient = (nuxtApp._supabaseClient as any)?.headers.Authorization !== Authorization

  // No need to recreate client if exists
  if (!nuxtApp._supabaseClient || recreateClient) {
    nuxtApp._supabaseClient = createSupabaseClient()
  }

  return nuxtApp._supabaseAuthClient as SupabaseClient<Database, SchemaName, Schema>
}
