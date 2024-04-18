import type { Session } from '@supabase/supabase-js'
import type { Ref } from 'vue'
import { useSupabaseClient } from './useSupabaseClient'
import { useState } from '#imports'

export const useSupabaseSession: () => Ref<Session | null> = () => {
  const supabase = useSupabaseClient()

  const sessionState = useState<Session | null>('supabase_session', () => null)

  // Asyncronous refresh session and ensure user is still logged in
  supabase?.auth.getSession().then(({ data: { session } }) => {
    if (session) {
      if (JSON.stringify(sessionState.value) !== JSON.stringify(session)) {
        sessionState.value = session
      }
    }
    else {
      sessionState.value = null
    }
  })

  return sessionState
}
