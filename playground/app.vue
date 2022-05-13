<template>
  <div>
    <h1>
      Supabase module playground!
    </h1>
    <button @click="callApi">
      Call API
    </button>
    <pre>
      {{ data }}
    </pre>
  </div>
</template>

<script setup>
const data = ref(null)

const callApi = async () => {
  data.value = await useFetch('/api/test')
}
</script>
