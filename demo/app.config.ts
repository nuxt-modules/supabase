export default defineAppConfig({
  ui: {
    colors: {
      primary: 'cyan',
      neutral: 'zinc',
    },
    input: {
      variants: {
        variant: {
          subtle: 'ring-default bg-elevated/50',
        },
      },
    },
    header: {
      slots: {
        root: 'border-none',
      },
    },
  },
})
