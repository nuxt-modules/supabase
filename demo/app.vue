<template>
  <div class="min-h-screen u-bg-black">
    <Title>Nuxt 3 x Supabase</Title>
    <div class="flex items-center justify-between">
      <UButton size="xl" variant="transparent" :icon="colorMode.preference === 'dark' ? 'heroicons-outline:moon' : 'heroicons-outline:sun'" @click="toggleDark" />
      <UButton v-if="!!user" class="u-text-white" size="xl" variant="transparent" @click="logout">
        Logout
      </UButton>
    </div>
    <div class="max-w-xl min-h-screen px-4 mx-auto sm:px-6 lg:px-8">
      <div class="min-h-screen -mt-[50px] flex items-center justify-center">
        <NuxtPage />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const client = useSupabaseClient()
const user = useSupabaseUser()
const colorMode = useColorMode()

const toggleDark = () => {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}

const logout = async () => {
  await client.auth.signOut()
  document.location.href = '/'
}
</script>
