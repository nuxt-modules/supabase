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

const fetchMe = async () => {
  user.value = await useFetch('/api/me', { headers: useRequestHeaders(['cookie']) })
}
</script>
