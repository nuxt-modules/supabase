export default defineAppConfig({
  header: {
    title: 'Nuxt Supabase',
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
