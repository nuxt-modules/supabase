<script setup lang="ts">
if (process.server) {
  // eslint-disable-next-line no-console
  console.log(
    'ERROR: It is very important to make sure that the redirect route right after login works without any server-side rendering. This is because the server-side rendering will not have the user data available. This is why we need to redirect to a client-side route right after login. This is a limitation of Supabase. If you are using Nuxt, you can use the no-ssr component to make sure that the redirect route is not server-side rendered.'
  )
}
const user = useSupabaseUser()
if (user.value) {
  await navigateTo('/user')
}
</script>
<template>
  <div>Waiting for login...</div>
</template>
