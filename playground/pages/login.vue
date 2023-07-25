<script setup lang="ts">
const supabase = useSupabaseClient()
const router = useRouter()

const signIn = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'github',
    options: {
      redirectTo: 'http://localhost:3000/confirm',
    },
  })
  if (error) console.log(error)
}

const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  if (error) console.log(error)
  //refresh the page to get the user object
  router.go(0)
}
</script>
<template>
  <div>
    <h1>Login</h1>
    <button @click="signIn">Sign In</button>
    <button @click="signOut">Sign Out</button>
  </div>
</template>
