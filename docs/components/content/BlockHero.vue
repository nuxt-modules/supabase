<script setup lang="ts">
defineProps({
  cta: {
    type: Array,
    default: () => ['Get started', '/get-started']
  },
  secondary: {
    type: Array,
    default: () => ['Open on GitHub', 'https://github.com']
  },
  snippet: {
    type: [String],
    default: () => ''
  }
})
</script>

<template>
  <section class="py-12 lg:py-24">
    <Container padded class="flex flex-col my-16 lg:flex-row">
      <div class="flex flex-col items-center pr-0 mb-8 lg:mb-0 lg:w-2/3 lg:items-start lg:pr-8">
        <h2 class="mb-8 text-5xl font-semibold tracking-tighter text-center text-gray-900 dark:text-gray-100 sm:text-6xl sm:leading-none lg:text-left lg:text-7xl">
          <Markdown :use="$slots.title" unwrap="p" />
        </h2>

        <Markdown :use="$slots.features" unwrap="p" />

        <div class="flex flex-col items-center mt-6 space-y-4 sm:mb-4 sm:flex-row sm:space-y-0 sm:space-x-4 lg:space-x-6">
          <ButtonLink v-if="cta" class="mx-auto md:mx-0" bold size="large" :href="(cta[1] as any)">
            {{ cta[0] }}
          </ButtonLink>

          <a
            v-if="secondary"
            :href="(secondary[1] as any)"
            class="py-px mt-px font-medium border-transparent text-secondary-active border-b-1 hover:border-primary-500 dark:hover:border-primary-400"
          >
            {{ secondary[0] }}
          </a>
        </div>
      </div>

      <div v-if="snippet" class="w-full mx-auto sm:w-580px lg:w-1/3">
        <div class="md:mx md:pl-2">
          <Terminal :content="snippet" />
        </div>
      </div>
    </Container>
  </section>
</template>
