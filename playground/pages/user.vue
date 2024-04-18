<!-- eslint-disable no-console -->
<script setup lang="ts">
const supabase = useSupabaseClient()
const user = useSupabaseUser()
const router = useRouter()
const session = useSupabaseSession()

if (import.meta.server) {
  console.log('User on server side: ', user.value?.email)
  console.log('Session on server side: ', session.value?.user?.email)
}
else {
  console.log('User on client side: ', user.value?.email)
  console.log('Session on client side: ', session.value?.user?.email)
}
const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  if (error) console.log(error)
  // refresh the page to get the user object
  router.go(0)
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
      {{ user.user_metadata.name || user.user_metadata.user_name || user.email }}
      <button @click="signOut">
        Sign Out
      </button>
      <NuxtLink to="/">
        Go to home page
      </NuxtLink>
    </div>
    <div v-else>
      No User - Should not occur due to auth redirect
    </div>
  </div>
</template>
