export default defineAppConfig({
  ui: {
    primary: 'green',
    gray: 'slate',

    footer: {
      bottom: {
        left: 'text-sm text-gray-500 dark:text-gray-400',
        wrapper: 'border-t border-gray-200 dark:border-gray-800',
      },
    },

    icons: {
      dark: 'i-heroicons-moon',
      light: 'i-heroicons-sun',
    },
  },
  header: {
    logo: {
      alt: 'logo nuxt supabase module',
      light: '/logo-nuxt-supabase-light.png',
      dark: '/logo-nuxt-supabase-dark.png',
    },
    search: true,
    colorMode: true,
    links: [{
      'icon': 'i-simple-icons-x',
      'to': 'https://x.com/nuxt_js',
      'target': '_blank',
      'aria-label': 'Nuxt on X',
    }, {
      'icon': 'i-simple-icons-github',
      'to': 'https://github.com/nuxt-modules/supabase',
      'target': '_blank',
      'aria-label': 'Module on GitHub',
    }, {
      'icon': 'i-simple-icons-nuxtdotjs',
      'to': 'https://nuxt.com',
      'target': '_blank',
      'aria-label': 'Nuxt official website',
    }, {
      'icon': 'i-simple-icons-supabase',
      'to': 'https://supabase.com',
      'target': '_blank',
      'aria-label': 'Supabase official website',
    }],
  },
  footer: {
    credits: 'Made with Nuxt Studio',
    colorMode: false,
    links: [{
      'icon': 'i-simple-icons-x',
      'to': 'https://x.com/nuxt_js',
      'target': '_blank',
      'aria-label': 'Nuxt on X',
    }, {
      'icon': 'i-simple-icons-github',
      'to': 'https://github.com/nuxt-modules/supabase',
      'target': '_blank',
      'aria-label': 'Module on GitHub',
    }, {
      'icon': 'i-simple-icons-nuxtdotjs',
      'to': 'https://nuxt.com',
      'target': '_blank',
      'aria-label': 'Nuxt official website',
    }, {
      'icon': 'i-simple-icons-supabase',
      'to': 'https://supabase.com',
      'target': '_blank',
      'aria-label': 'Supabase official website',
    }],
  },
  toc: {
    title: 'Table of Contents',
    bottom: {
      title: 'Community',
      edit: 'https://github.com/nuxt-modules/supabase/edit/main/docs/content',
      links: [{
        icon: 'i-heroicons-star',
        label: 'Star on GitHub',
        to: 'https://github.com/nuxt-modules/supabase',
        target: '_blank',
      }, {
        icon: 'i-simple-icons-nuxtdotjs',
        label: 'Nuxt docs',
        to: 'https://nuxt.com',
        target: '_blank',
      }, {
        icon: 'i-simple-icons-supabase',
        label: 'Supabase docs',
        to: 'https://supabase.com',
        target: '_blank',
      }],
    },
  },
})
