<script setup lang="ts">
const supabase = useSupabaseClient()
const router = useRouter()

const signInWithOAuth = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'github',
    options: {
      redirectTo: 'http://localhost:3000/confirm',
    },
  })
  if (error) console.log(error)
}

const signIn = async () => {
  const { error } = await supabase.auth.signInWithOtp({
    email: email.value,
    options: {
      emailRedirectTo: 'http://localhost:3000/confirm',
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

const email = ref('')
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
    <h1>Login</h1>
    <button @click="signInWithOAuth">Sign In with OAuth</button>
    <button @click="signIn">Sign In with E-Mail</button>
    <input
      v-model="email"
      type="email"
    />
    <button @click="signOut">Sign Out</button>
  </div>
</template>
