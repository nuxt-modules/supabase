<script setup lang="ts">
const router = useRouter()
const user = useSupabaseUser()
const { auth } = useSupabaseClient()
const colorMode = useColorMode()
const toggleDark = () => {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}
const colorModeIcon = computed(() => colorMode.preference === 'dark' ? 'heroicons-outline:moon' : 'heroicons-outline:sun')
const logout = async () => {
  await auth.signOut()
  router.push('/')
}
</script>

<template>
  <div>
    <Title>Nuxt 3 x Supabase</Title>
    <div class="flex items-center md:justify-between justify-center">
      <div class="hidden md:block">
        <UButton
          label="Source"
          variant="transparent"
          target="_blank"
          to="https://github.com/nuxt-community/supabase-module/tree/main/demo"
          icon="heroicons-outline:external-link"
        />
        <UButton
          label="Hosted on Netlify"
          variant="transparent"
          target="_blank"
          to="https://netlify.com"
          icon="heroicons-outline:external-link"
        />
      </div>
      <div class="flex items-center">
        <UButton variant="transparent" :icon="colorModeIcon" @click="toggleDark" />
        <UButton v-if="user" class="u-text-white" variant="transparent" @click="logout">
          Logout
        </UButton>
      </div>
    </div>
  </div>
</template>
