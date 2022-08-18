<template>
  <button @click="client.auth.signInWithOAuth({ provider: 'github', options: { redirectTo: 'http://localhost:3000/confirm'} })">
    LogIn
  </button>
</template>

<script setup lang="ts">
const user = useSupabaseUser()
const client = useSupabaseClient()

watchEffect(() => {
  if (user.value) {
    navigateTo('/me')
  }
})

</script>
