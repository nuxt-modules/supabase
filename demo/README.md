# Todo list example using Supabase and Nuxt 3

Live demo: https://n3-supabase.netlify.app

- Frontend:
  - [Nuxt 3](https://v3.nuxtjs.org/) - a Vuejs framework.
  - [Tailwind](https://tailwindcss.com/) for styling and layout.
  - [Supabase Module](https://github.com/nuxt-community/supabase-module) for user management and supabase data client.
- Backend:
  - [app.supabase.io](https://app.supabase.io/): hosted Postgres database with restful API for usage with Supabase.js.

## Setup

Make sure to install the dependencies

```bash
yarn install
```

Fill the `.env` with the Supabase environement variables:

```
SUPABASE_URL="https://example.supabase.com"
SUPABASE_KEY="<your_key>"
```

In your Supabase project, make sure to create the `tasks` table with the following fields:

![tasks_table](https://user-images.githubusercontent.com/7290030/159882068-c88b96da-6e2f-4d9b-8523-4a4270b1b05e.png)

## Development

Start the development server on http://localhost:3000

```bash
yarn dev
```

## Production

Build the application for production:

```bash
yarn build
```

Checkout the [deployment documentation](https://v3.nuxtjs.org/docs/deployment).
