---
title: useSupabaseSession
description: Auto import and use your Supabase user's session with the useSupabaseSession composable
---

Once logged in, you can [auto-import](https://nuxt.com/docs/guide/directory-structure/composables) your user's session everywhere inside your vue files.

```vue
<script setup>
const session = useSupabaseSession()
</script>
```

::tip
If you just need the User's information you can use [useSupabaseUser](/composables/usesupabaseuser) which returns just the User information of the session. 
::

## Auth middleware

::tip
By default, the module is implementing a redirect middleware. All pages of your application are automatically redirected to the [login](/getting-started/introduction#redirectoptions) page. However, you can allow redirection to "public" pages by setting the [exclude](/getting-started/introduction#redirectoptions) redirect option. Alternatively, you can enable the redirect only for certain routes using the [include](/getting-started/introduction#redirectoptions) redirect option.
::

If the [redirect](/getting-started/introduction#redirect) option is disabled, you can protect your authenticated routes by creating a custom middleware in your project, here is an example:

```ts [middleware/auth.ts]
export default defineNuxtRouteMiddleware((to, _from) => {
  const session = useSupabaseSession()

  if (!session.value) {
    return navigateTo('/login')
  }
})
```

Then you can reference your middleware in your page with:

```ts [pages/dashboard.vue]
definePageMeta({
  middleware: 'auth'
})
```

Learn more about [Nuxt middleware](https://nuxt.com/docs/guide/directory-structure/middleware) and [definePageMeta](https://nuxt.com/docs/guide/directory-structure/pages#page-metadata).
