export default defineAppConfig({
  seo: {
    title: 'Nuxt Supabase',
    description: 'A supa simple wrapper around supabase-js to enable usage and integration within Nuxt.',
  },
  header: {
    logo: {
      light: 'logo-nuxt-supabase-light.png',
      dark: 'logo-nuxt-supabase-dark.png',
      alt: 'Nuxt Supabase',
    },
  },
  socials: {
    x: 'https://x.com/nuxt_js',
    discord: 'https://discord.com/invite/ps2h6QT',
    nuxt: 'https://nuxt.com',
  },
  toc: {
    edit: 'https://github.com/nuxt-modules/supabase/edit/main/docs/content',
    links: [{
      icon: 'i-lucide-book-open',
      label: 'Nuxt  docs',
      to: 'https://nuxt.com/docs',
      target: '_blank',
    }, {
      icon: 'i-simple-icons-nuxtdotjs',
      label: 'Supabase docs',
      to: 'https://supabase.com/docs',
      target: '_blank',
    }],
  },
})
