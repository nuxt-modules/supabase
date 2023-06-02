<script setup lang="ts">
const user = useSupabaseUser()
const client = useSupabaseAuthClient()

const logout = async () => {
  await client.auth.signOut()

  // Wait for the authChanged event to have been fired
  watchEffect(() => {
    if (!user.value) {
      navigateTo('/')
    }
  })
}
</script>

<template>
  <div>
    <div style="display: flex; justify-content: space-between;">
      <h1>
        Supabase module playground
      </h1>
      <button
        v-if="user"
        style="height: fit-content;"
        @click="logout"
      >
        Logout
      </button>
    </div>
    <NuxtPage />
  </div>
</template>
