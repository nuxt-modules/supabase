<template>
  <div>
    <h1>
      Supabase module playground!
    </h1>
    <button @click="fetchMe">
      Fetch me from server route !
    </button>
    <pre>
      {{ user }}
    </pre>
  </div>
</template>

<script setup>
const user = ref(null)

const { data } = await useFetch('/api/me', {
  headers: useRequestHeaders(['cookie'])
})

user.value = data
</script>
