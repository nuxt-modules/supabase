import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  declaration: true,
  rollup: { cjsBridge: true },
  entries: [
    './src/module',
    { input: 'src/runtime/', outDir: 'dist/runtime' }
  ],
  externals: ['@nuxt/kit', '@nuxt/schema', '@supabase/supabase-js']
})
