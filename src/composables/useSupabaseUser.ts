import type { Ref } from 'vue'
import { User } from '@supabase/supabase-js'
import { useState } from '#app'

export const useSupabaseUser = (): Ref<User | null> => useState<User | null>('supabase_user')
