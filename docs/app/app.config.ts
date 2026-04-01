export default defineAppConfig({
  header: {
    logo: {
      light: '/logo-nuxt-supabase-light.png',
      dark: '/logo-nuxt-supabase-dark.png',
      alt: 'Nuxt Supabase',
    },
  },
  socials: {
    x: 'https://x.com/nuxt_js',
    discord: 'https://discord.com/invite/ps2h6QT',
    nuxt: 'https://nuxt.com',
    supabase: 'https://supabase.com/docs',
  },
  github: {
    rootDir: 'docs',
  },
  toc: {
    bottom: {
      title: 'Community',
      links: [{
        icon: 'i-simple-icons-nuxt',
        label: 'Nuxt docs',
        to: 'https://nuxt.com/docs',
        target: '_blank',
      }, {
        icon: 'i-simple-icons-supabase',
        label: 'Supabase docs',
        to: 'https://supabase.com/docs',
        target: '_blank',
      }],
    },
  },
})
