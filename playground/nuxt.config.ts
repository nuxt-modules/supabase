import { defineNuxtConfig } from 'nuxt'
import SupabaseModule from '..'

export default defineNuxtConfig({
  modules: [
    SupabaseModule
  ],
  myModule: {
    addPlugin: true
  }
})
