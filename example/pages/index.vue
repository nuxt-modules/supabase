<template>
  <div>
    <h1>@nuxtjs/supabase</h1>
    <h2>User</h2>
    <pre>{{ user }}</pre>
  </div>
</template>

<script lang="ts" setup>
const user = useSupabaseUser()
</script>
