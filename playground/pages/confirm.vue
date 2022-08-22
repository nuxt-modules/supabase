<script setup lang="ts">
const user = useSupabaseUser()

watchEffect(() => {
  if (user.value) {
    navigateTo('/me')
  }
})
</script>

<template>
  <p>
    Redirecting...
  </p>
</template>
