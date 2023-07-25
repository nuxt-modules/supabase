<script setup lang="ts">
import { useSupabaseClient, useSupabaseUser } from '#imports'
const supabase = useSupabaseClient()
const user = await useSupabaseUser()
const router = useRouter()
if (process.server) {
  console.log('User on server side: ', user)
} else {
  console.log('User on client side: ', user)
}
const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  if (error) console.log(error)
  //refresh the page to get the user object
  router.push('/login')
}
</script>
<template>
  <div>
    <div
      v-if="user"
      style="
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        height: 100vh;
        gap: 20px;
      "
    >
      {{ user.user_metadata.name }}
      <button @click="signOut">Sign Out</button>
      <NuxtLink to="/">Go to home page, test if session persists on navigation</NuxtLink>
    </div>
    <div v-else>No User - Should not occur due to auth redirect</div>
  </div>
</template>
