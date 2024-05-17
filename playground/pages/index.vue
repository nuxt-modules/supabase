<script setup lang="ts">
import type { Database } from '~~/types/database.types'

const supabase = useSupabaseClient<Database>()
const user = useSupabaseUser()

const { data } = useAsyncData(async () => {
  // const { data } = await supabase.from('test').select('*')
  const { data } = await supabase.from('pushupers')
    .select('*')
    .eq('email', user.value?.email)
    .single()

  return data
})

const { data: api } = await useFetch('/api/test')

const signOut = async () => {
  const { error } = await supabase.auth.signOut()

  if (error) console.log(error)
  return navigateTo('/login')
}
</script>

<template>
  <div
    style="
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      height: 100vh;
      gap: 20px;
    "
  >
    <h1>Home</h1>
    <div>Data fetched with useSupabaseClient composable</div>
    <pre>{{ data }}</pre>
    <div>Data fetched from server route API</div>
    <pre>{{ api }}</pre>
    <NuxtLink to="/user">
      Go to user page
    </NuxtLink>
    <button @click="signOut">
      Sign Out
    </button>
  </div>
</template>
