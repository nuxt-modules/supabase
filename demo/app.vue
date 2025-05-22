<template>
  <UApp>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>

<script setup lang="ts">
useHead({
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
  ],
  link: [
    { rel: 'icon', href: '/favicon.ico' },
  ],
  htmlAttrs: {
    lang: 'en',
  },
})

const title = 'Nuxt 3 x Supabase'
const description = 'Demo of a simple todo list app using Nuxt and Supabase.'

useSeoMeta({
  title,
  ogTitle: title,
  description,
  ogDescription: description,
})
</script>
