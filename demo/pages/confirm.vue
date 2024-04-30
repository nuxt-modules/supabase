<script setup lang="ts">
const user = await useSupabaseUser()

watch(user, () => {
  if (user.value) {
    return navigateTo('/tasks')
  }
}, { immediate: true })
</script>

<template>
  <div>
    <p class="u-text-black">
      Redirecting...
    </p>
  </div>
</template>
