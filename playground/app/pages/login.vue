<!-- eslint-disable no-console -->
<script setup lang="ts">
const supabase = useSupabaseClient()
const user = useSupabaseUser()

watchEffect(() => {
  // Can be uncommented in next nuxt version when https://github.com/nuxt/nuxt/issues/21841 is fixed
  if (user.value) {
    console.log('navigate to / !')
    // return navigateTo('/')
  }
})

const signInWithOAuth = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'github',
    options: {
      redirectTo: 'http://localhost:3000/confirm',
    },
  })
  if (error) console.log(error)
}

const signIn = async () => {
  const { error } = await supabase.auth.signInWithOtp({
    email: email.value,
    options: {
      emailRedirectTo: 'http://localhost:3000/confirm',
    },
  })
  if (error) console.log(error)
}

const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  if (error) console.log(error)
}

const email = ref('')
</script>

<template>
  <div
    style="
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      height: 100vh;
      gap: 20px;
    "
  >
    <h1>Login</h1>
    <button @click="signInWithOAuth">
      Sign In with OAuth (GitHub)
    </button>
    <button @click="signIn">
      Sign In with E-Mail
    </button>
    <input
      v-model="email"
      type="email"
    >
    <template v-if="user">
      <NuxtLink to="/">
        Go to home page
      </NuxtLink>
      <button
        @click="signOut"
      >
        Sign Out
      </button>
    </template>
  </div>
</template>
