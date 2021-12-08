import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: [
    './src/module',
    { input: 'src/plugins/', outDir: 'dist/plugins' },
    { input: 'src/composables/', outDir: 'dist/composables' },
    { input: 'src/types/', outDir: 'dist/types' }
  ],
  externals: ['@nuxt/kit', '@nuxt/schema', 'defu', 'pathe'],
  declaration: true
})
