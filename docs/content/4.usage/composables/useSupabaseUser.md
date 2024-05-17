---
title: useSupabaseUser
description: Auto import and use your Supabase user with the useSupabaseUser composable
---

Once logged in, you can [auto-import](https://nuxt.com/docs/guide/directory-structure/composables) your user everywhere inside your vue files.

```vue
<script setup>
const user = useSupabaseUser()
</script>
```

## Auth middleware

::callout{icon="i-heroicons-light-bulb"}
By default, the module is implementing a redirect middleware. All pages of your application are automatically redirected to the [login](/get-started#redirectoptions) page. However, you can allow redirection to "public" pages by setting the [exclude](/get-started#redirectoptions) redirect option. Alternatively, you can enable the redirect only for certain routes using the [include](/get-started#redirectoptions) redirect option.
::

If the [redirect](/get-started#redirect) option is disabled, you can protect your authenticated routes by creating a custom middleware in your project, here is an example:

```ts [middleware/auth.ts]
export default defineNuxtRouteMiddleware((to, _from) => {
  const user = useSupabaseUser()

  if (!user.value) {
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
