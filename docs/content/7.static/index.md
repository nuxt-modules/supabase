# Static Usage

related issues :
* https://github.com/nuxt-modules/supabase/issues/138
* https://github.com/nuxt-modules/supabase/issues/146



## conf

```javascript
supabase: {
    cookies: {
        clientOnly: true,
    },
},
```

## refactoring

server API `server/api/session`

endpoint `/api/_supabase/session`

used in `setServerSession()`

used in `nuxtApp.hooks.hook('app:mounted' ...` only (2 times)

## Quick test

Start a new nuxt project :
```shell
npx nuxi@latest init my-static-app
cd my-static-app
pnpm install
pnpm add -D @nuxtjs/supabase
```

Update `nuxt.config.ts`
(note the `clientOnly` setting to disable thre server cookie API):
```typescript
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    modules: ['@nuxtjs/supabase'],
    supabase: {
        cookies: {
            clientOnly: true,
        },
    },
})
```

Create `.env` with your supabase project credentials :
```shell
SUPABASE_URL="https://example.supabase.co"
SUPABASE_KEY="<your_key>"
```


Generate the static site and serve it :
```shell
pnpm generate
cd .output/public
python3 -m http.server 3000
```

Modify `app.vue` :
```html
<script setup lang="ts">
const user = useSupabaseUser()
const client = useSupabaseAuthClient()
const email = ref("philippe.entzmann@gmail.com")
const spinner_show = ref(false)

async function login() {
  spinner_show.value = true

  const { data, error } = await client.auth.signInWithOtp({
    email: email.value,
    options: {emailRedirectTo: 'http://localhost:3000/'},
  })
}

async function logout() {
  await client.auth.signOut()
  location.reload()
}
</script>

<template>
  <p>Refresh page after each login/logout</p>
  <div v-if="!user" >
    Your email : <input v-model="email">
    <br />
    <button @click="login()">Login with magic email</button>
  </div>
  <div v-if="user">
    User connected ! email : {{ user.email }}, id : {{ user.id }}
    <br />
    <button @click="logout()">Logout</button>
  </div>
  <br />
  <p v-if="spinner_show">Check your email, click and the magic link and refresh that page ...</p>
</template>
```

Point a broswser to `http://localhost:3000`,
you should be able to login/logout
without any error in this fully static site.

# Dev session

To develop you may use the `pnpm link` feature.

```shell
# you dev folder
cd supabase
yarn link
# your test app
cd ..
npx nuxi@latest init my-static-app
cd my-static-app
yarn install
#yarn add -D @nuxtjs/supabase
yarn link "@nuxtjs/supabase"
# apply modification from quick test section 
# ...
# start dev session
yarn dev
```