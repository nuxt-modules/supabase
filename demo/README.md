# Todo list example using Supabase and Nuxt 3

[![n3-supabase-demo](/demo.png)](https://supabase-demo-gamma.vercel.app)

Live demo: https://supabase-demo-gamma.vercel.app

- Frontend:
  - [Nuxt 3](https://nuxt.com/) - The Vue Framework for Web Architects
  - [Nuxt UI Pro](https://ui.nuxt.com/) for components
  - [TailwindCSS](https://tailwindcss.com/) for styling and layout.
  - [Supabase Module](https://github.com/nuxt-modules/supabase) for user management and supabase data client.
- Backend:
  - [app.supabase.io](https://app.supabase.com/): hosted Postgres database with restful API for usage with Supabase.js.

## Setup

Make sure to install the dependencies

```bash
pnpm i
```

Create a project on [Supabase](https://supabase.com).

In your Supabase project, make sure to create the `tasks` table with the following fields:

![tasks_table](https://user-images.githubusercontent.com/7290030/159882068-c88b96da-6e2f-4d9b-8523-4a4270b1b05e.png)

Create a GitHub Oauth Application on https://github.com/settings/applications/new

Grant read access to Email addresses under User Permissions

With homepage url being http://localhost:3000

For the callback url, please refer to https://supabase.com/docs/guides/auth/auth-github#find-your-callback-url

Then, enable the GitHub Oauth Provider in your Supabase project (Authentication -> Settings):

![oauth_github](https://user-images.githubusercontent.com/904724/160397056-53099b19-1673-402d-86a2-4c18618a6ab3.png)

Go to your supabase project settings, API section and get the project API key and url and fill the `.env` with them:

```
SUPABASE_URL="https://example.supabase.com"
SUPABASE_KEY="<your_key>"
```

## Development

Start the development server on http://localhost:3000

```bash
pnpm dev
```

## Production

> [!WARNING]
> This project uses [Nuxt UI Pro](https://ui.nuxt.com/pro), you need a license to deploy it in production. However, you can use it for free in development.

Build the application for production:

```bash
pnpm build
```

Checkout the [deployment documentation](https://nuxt.com/deploy).
