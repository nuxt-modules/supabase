<script setup lang="ts">
const user = useSupabaseUser()
const client = useSupabaseAuthClient()
const email = ref("alice@acme.com")

watchEffect(() => {
  if (user.value) {
    navigateTo('/me')
  }
})

async function login() {
  const { data, error } = await client.auth.signInWithOtp({
    email: email.value,
    options: {emailRedirectTo: 'http://localhost:3000/'},
  })
}

</script>

<template>
  <div>
    <h1>signInWithOAuth</h1>
    <button @click="client.auth.signInWithOAuth({ provider: 'github', options: { redirectTo: 'http://localhost:3000/confirm'} })">
      LogIn
    </button>
    <hr />

    <h1>signInWithOtp</h1>
    Your email : <input v-model="email">
    <br />
    <button @click="login()">Login with magic email</button>    
    <hr />

  </div>
</template>
