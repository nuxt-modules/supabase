<template>
  <iframe
    style="width: 100%; min-height: calc(100vh / 1.5)"
    :src="src"
  />
</template>

<script setup lang="ts">
const props = defineProps({
  token: {
    type: String,
    required: true,
  },
})

const src = computed(() => `https://volta.net/embed/${props.token}`)
</script>
