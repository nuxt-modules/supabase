<template>
  <div>
    <div style="display: flex; justify-content: space-between;">
      <h1>
        Supabase module playground
      </h1>
      <button v-if="user" @click="client.auth.signOut">
        Logout
      </button>
    </div>
    <button v-if="!user" @click="client.auth.signInWithOAuth({ provider: 'github' })">
      LogIn
    </button>
    <div v-if="user">
      <h2>
        Authenticated as {{ user.user_metadata.full_name }}!
      </h2>
      <button @click="fetchMe">
        Fetch me from server route !
      </button>
      <pre>
        {{ userFromServer }}
       </pre>
    </div>
  </div>
</template>

<script setup>
const client = useSupabaseClient()
const user = useSupabaseUser()
const userFromServer = ref(null)

const fetchMe = async () => {
  userFromServer.value = await useFetch('/api/me', { headers: useRequestHeaders(['cookie']) })
}
</script>
