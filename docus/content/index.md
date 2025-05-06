---
seo:
  title: Nuxt Supabase - Home
  description: A supa simple wrapper around supabase-js to enable usage and integration within Nuxt.
---

::u-page-hero
---
orientation: horizontal
---
  :::prose-pre
  ---
  filename: Terminal
  ---
  ```ts
  const supabase = useSupabaseClient()
  const email = ref('')

  const signInWithOtp = async () => {
    await supabase.auth.signInWithOtp({
      email: email.value,
    })
  }
  ```
  :::

#title
Supabase

#description
A supa simple wrapper around supabase-js to enable usage and integration within Nuxt.

#links
  :::u-button
  ---
  size: xl
  to: /get-started
  trailing-icon: i-lucide-arrow-right
  ---
  Get started
  :::

  :::u-button
  ---
  color: neutral
  icon: i-lucide-star
  size: xl
  target: _blank
  to: https://github.com/nuxt-ui-pro/docs
  variant: subtle
  ---
  Star on github
  :::
::

::u-page-section
#title
Shipped with many features

#links
  :::u-button
  ---
  color: neutral
  size: lg
  target: _blank
  to: https://ui.nuxt.com/getting-started/installation/pro/nuxt
  trailingIcon: i-lucide-arrow-right
  variant: subtle
  ---
  Discover Nuxt UI Pro v3
  :::

#features
  :::u-page-feature
  ---
  icon: i-simple-icons-nuxtdotjs
  target: _blank
  to: https://nuxt.com
  ---
  #title
  Nuxt 3 ready
  
  #description
  Experience the power and flexibility of Nuxt 3, optimized for modern web development.
  :::

  :::u-page-feature
  ---
  icon: i-simple-icons-vuedotjs
  target: _blank
  to: https://vuejs.org/guide/reusability/composables.html
  ---
  #title
  Vue 3 composables
  
  #description
  Leverage the reusability and efficiency of Vue 3 composables in your projects.
  :::

  :::u-page-feature
  ---
  icon: i-simple-icons-supabase
  target: _blank
  to: https://supabase.com
  ---
  #title
  Supabase-js V2
  
  #description
  Empower Supabase for robust backend functionality.
  :::

  :::u-page-feature
  ---
  icon: i-lucide-server
  to: usage/services/serversupabaseclient
  ---
  #title
  Usage in API server routes
  
  #description
  Implement Supabase in your API server routes.
  :::

  :::u-page-feature
  ---
  icon: i-lucide-key
  to: /authentication
  ---
  #title
  Authentication support
  
  #description
  Secure your applications with authentication support provided by Supabase.
  :::

  :::u-page-feature
  ---
  icon: i-simple-icons-typescript
  target: _blank
  to: https://www.typescriptlang.org
  ---
  #title
  TypeScript support
  
  #description
  Enjoy a fully typed development experience.
  :::
::
