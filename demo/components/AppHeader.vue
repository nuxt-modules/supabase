<script setup lang="ts">
const router = useRouter()
const client = useSupabaseClient()
const user = useSupabaseUser()
const colorMode = useColorMode()
const toggleDark = () => {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}
const colorModeIcon = computed(() => colorMode.preference === 'dark' ? 'heroicons-outline:moon' : 'heroicons-outline:sun')
const logout = async () => {
  await client.auth.signOut()
  router.push('/')
}
</script>

<template>
  <div>
    <Title>Nuxt 3 x Supabase</Title>
    <div class="flex items-center justify-between">
      <div>
        <UButton size="xl" variant="transparent" :icon="colorModeIcon" @click="toggleDark" />
        <UButton
          size="xl"
          label="Source"
          variant="transparent"
          target="_blank"
          to="https://github.com/nuxt-community/supabase-module/tree/main/demo"
          icon="heroicons-outline:external-link"
          @click="toggleDark"
        />
      </div>
      <UButton v-if="user" class="u-text-white" size="xl" variant="transparent" @click="logout">
        Logout
      </UButton>
    </div>
  </div>
</template>
