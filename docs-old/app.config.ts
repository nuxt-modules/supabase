export default defineAppConfig({
  docus: {
    title: 'Nuxt Supabase',
    description: 'A supa simple wrapper around supabase-js to enable usage and integration within Nuxt.',
    image: '/cover.jpg',

    socials: {
      twitter: 'nuxt_js',
      github: 'nuxt-modules/supabase',
      nuxt: {
        label: 'Nuxt',
        icon: 'simple-icons:nuxtdotjs',
        href: 'https://nuxt.com'
      },
      supabase: {
        label: 'Supabase',
        icon: 'simple-icons:supabase',
        href: 'https://supabase.com'
      }
    },

    github: {
      dir: 'docs/content',
      branch: 'main',
      repo: 'supabase',
      owner: 'nuxt-modules',
      edit: true
    },

    aside: {
      level: 0,
      collapsed: false,
      exclude: []
    },

    main: {
      padded: true,
    },

    header: {
      logo: true,
      showLinkIcon: true,
      exclude: [],
      title: 'Nuxt Supabase'
    },

    footer: {
      credits: {
        text: 'Made with Nuxt Studio',
        icon: 'simple-icons:nuxtdotjs',
        href: 'https://nuxt.studio'
      }
    },

    titleTemplate: '%s · Nuxt Supabase'
  }
})
