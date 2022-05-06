<script setup lang="ts">

const data = ref(null)

const callServerClient = async () => {
  data.value = await $fetch('/api/test')
}

</script>

<template>
  <div>
    <h1>
      Supabase module playground!
    </h1>
    <button @click="callServerClient">
      Get data from server routes
    </button>
    <pre>
      {{ data }}
    </pre>
  </div>
</template>
