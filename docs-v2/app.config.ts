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
      }
    },

    github: {
      dir: '.starters/default/content',
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
      fluid: true
    },

    header: {
      logo: false,
      showLinkIcon: true,
      exclude: [],
      fluid: true,
      title: 'Nuxt Supabase'
    },

    footer: {
      credits: {
        text: 'Built with Nuxt Studio',
        icon: 'none',
        href: 'https://nuxt.studio'
      }
    },

    titleTemplate: '%s · Nuxt Supabase'
  }
})