export default defineAppConfig({
  ui: {
    colors: {
      primary: 'orange',
      neutral: 'zinc',
    },
    input: {
      variants: {
        variant: {
          subtle: 'ring-default bg-elevated/50',
        },
      },
    },
  },
  uiPro: {
    header: {
      slots: {
        root: 'border-none',
      },
    },
  },
})
