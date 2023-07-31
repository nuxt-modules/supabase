<script setup lang="ts">
const supabase = useSupabaseClient()
const router = useRouter()
const { data } = await supabase.from('test').select('*')

const { data: api } = await useFetch('/api/test')

const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  if (error) console.log(error)
  //refresh the page to get the user object
  router.go(0)
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
    <div>Data fetched from setup SSR (server and client)</div>
    <pre>{{ data }}</pre>
    <div>Data fetched from API</div>
    <pre>{{ api }}</pre>
    <NuxtLink to="/user">Go to user page</NuxtLink>
    <button @click="signOut">Sign Out</button>
  </div>
</template>
