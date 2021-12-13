import { withDocus } from 'docus'

export default withDocus({
  target: 'static',
  rootDir: __dirname,
  buildModules: [
    'vue-plausible'
  ],
  plausible: {
    domain: 'supabase.nuxtjs.org'
  }
})
