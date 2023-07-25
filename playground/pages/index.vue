<script setup lang="ts">
const supabase = useSupabaseClient()
const { data } = await supabase.from('test').select('*')
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
    <pre>{{ data }}</pre>
  </div>
</template>
