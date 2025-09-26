---
seo:
  title: Supabase Integration for Nuxt
  description: A supa simple wrapper around supabase-js to enable usage and
    integration within Nuxt.
  ogImage: https://supabase.nuxtjs.org/social-card.png
---

::u-page-hero
---
orientation: horizontal
---
  :::prose-pre{filename="pages/login.vue"}
  ```vue
  <script setup lang="ts">
  const supabase = useSupabaseClient()
  const email = ref('')
  
  async function signInWithOtp() {
    await supabase.auth.signInWithOtp({
      email: email.value
    })
  }
  </script>
  
  <template>
    <input
      type="email"
      v-model="email"
      @keyup.enter="signInWithOtp()"
      placeholder="Login with email" 
    />
  </template>
  ```
  :::

#title
[Nuxt]{.text-primary} Supabase

#description
A supa simple wrapper around supabase-js to enable usage and integration within Nuxt.

#links
  :::u-button
  ---
  size: xl
  to: /getting-started/introduction
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
  to: https://github.com/nuxt-modules/supabase
  variant: subtle
  ---
  Star on GitHub
  :::

#headline
  :::u-button{size="sm" to="/getting-started/migration" variant="outline"}
   Nuxt Supabase v2 →
  :::
::

::u-page-section
#title
Shipped with many features

#features
  :::u-page-feature
  ---
  icon: i-simple-icons-nuxtdotjs
  target: _blank
  to: https://nuxt.com
  ---
  #title
  Nuxt 3 and 4 ready

  #description
  Experience the power and flexibility of Nuxt 3 and Nuxt 4, optimized for modern web development.
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
  to: services/serversupabaseclient
  ---
  #title
  Usage in API server routes
  
  #description
  Implement Supabase in your API server routes.
  :::

  :::u-page-feature
  ---
  icon: i-lucide-key
  to: /getting-started/authentication
  ---
  #title
  Authentication support with JWT signing keys
  
  #description
  Secure your applications with authentication support provided by Supabase with JWT signing keys support.
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
