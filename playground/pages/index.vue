<script setup lang="ts">
const supabase = useSupabaseClient()
const { data } = await supabase.from('test').select('*')

const { data: api } = await useFetch('/api/test')
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
    <h1>Home</h1>
    <div>Data fetched from setup SSR (server and client)</div>
    <pre>{{ data }}</pre>
    <div>Data fetched from API</div>
    <pre>{{ api }}</pre>
  </div>
</template>
