---
title: useSupabaseCookieRedirect
description: Handle redirecting users to the page they previously tried to visit after login
---

The `useSupabaseCookieRedirect` composable provides a simple way to handle storing and retrieving a redirect path with a cookie.

## Usage

This composable can be [manually used](#manual-usage) to save and retrieve a redirect path. However, the redirect path can automatically be set via the `saveRedirectToCookie` option in the [redirectOptions](/getting-started/introduction#redirectoptions).

The redirect path is not automatically used. Instead you must implement the logic to redirect the user to the saved path, for example on the [`/confirm`](/getting-started/authentication#confirm-page-confirm) page.

```vue
<script setup>
const user = useSupabaseUser()
const redirectInfo = useSupabaseCookieRedirect()

watch(user, () => {
  if (user.value) {
    // Get the saved path and clear it from the cookie
    const path = redirectInfo.pluck()
    // Redirect to the saved path, or fallback to home
    return navigateTo(path || '/')
  }
}, { immediate: true })
</script>
```

## Return Values

The composable returns an object with the following properties:

- `path`: A reactive cookie reference containing the redirect path. Can be both read and written to.
- `pluck()`: A convenience method that returns the current redirect path and clears it from the cookie.

## Manual Usage

You can also manually set and read the redirect path:

```ts
const redirectInfo = useSupabaseCookieRedirect()

// Save a specific path
redirectInfo.path.value = '/dashboard'

// Read the current path without clearing it
const currentPath = redirectInfo.path.value

// Get the path and clear it
const path = redirectInfo.pluck()
``` 

The cookie is saved with the name `{cookiePrefix}-redirect-path` where `cookiePrefix` is defined in the [runtime config](/getting-started/introduction#runtime-config).
