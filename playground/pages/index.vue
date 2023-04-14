<script setup lang="ts">
const user = useSupabaseUser()
const client = useSupabaseAuthClient()

watchEffect(() => {
  if (user.value) {
    navigateTo('/me')
  }
})
</script>

<template>
  <button @click="client.auth.signInWithOAuth({ provider: 'github', options: { redirectTo: 'http://localhost:3000/confirm'} })">
    LogIn
  </button>
</template>
