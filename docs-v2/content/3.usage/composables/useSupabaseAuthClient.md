---
description: Handle Supabase authentification actions with useSupabaseAuthClient composable
---

[Auto-import](https://nuxt.com/docs/guide/directory-structure/composables) your client inside your vue files.

This composable is using [supabase-js](https://github.com/supabase/supabase-js/) under the hood, it gives access to the [Supabase client](https://supabase.com/docs/reference/javascript/initializing) in order to handle authentification actions, all methods are available on [Supabase Auth](https://supabase.com/docs/reference/javascript/auth-signup) Documentation.

> The client is initialized with the `SUPABASE_KEY` you must have in your `.env` file.

::alert
This client is dedicated to authentification purpose only. It won't be recreated if your token expires, it is used in the client plugin to listen to `onAuthStateChange` events. If you want to fetch data from the db, please use the [useSupabaseClient](/usage/composables/usesupabaseclient) instead.
::

## SignIn

Here is an example of the login using the `signInWithOAuth` method with [third-party providers](https://supabase.com/docs/reference/javascript/auth-signinwithoauth).

```vue [pages/login.vue]
<script setup lang="ts">
const user = useSupabaseUser()
const client = useSupabaseAuthClient()
const router = useRouter()

// Login method using providers
const login = async (provider: 'github' | 'google' | 'gitlab' | 'bitbucket') => {
  const { error } = await client.auth.signInWithOAuth({ provider })

  if (error) {
    return alert('Something went wrong !')
  }

  router.push('/dashboard')
}
</script>

<template>
  <button @click="login('github')">Login with GitHub</button>
</template>
```

::alert
Thanks to the [Nuxt plugin](https://nuxt.com/docs/guide/directory-structure/plugins), we are listening to the [onAuthStateChange](https://supabase.com/docs/reference/javascript/auth-onauthstatechange) listener in order to update the user value according to the received event. We also keep the session consistency between client and server side.
::

> Take a look at the [auth middleware](/usage/composables/usesupabaseuser#auth-middleware) section to learn how to leverage Nuxt middleware to protect your routes for unauthenticated users.

## SignOut

Check [Supabase Documentation](https://supabase.com/docs/reference/javascript/auth-signout) for further details.

```vue
<script setup>
const client = useSupabaseAuthClient()
</script>

<template>
  <button @click="client.auth.signOut()">Logout</button>
</template>
```