---
title: useSupabaseClient
description: Make requests to the Supabase API with the useSupabaseClient composable
---

[Auto-import](https://nuxt.com/docs/guide/directory-structure/composables) your client inside your vue files.

This composable is using [supabase-js](https://github.com/supabase/supabase-js/) under the hood, it gives access to the [Supabase client](https://supabase.com/docs/reference/javascript/initializing).

> The client is initialized with the `SUPABASE_KEY` you must have in your `.env` file. It establishes the connection with the database and make use of user JWT to apply [RLS Policies](https://supabase.com/docs/learn/auth-deep-dive/auth-row-level-security) implemented in Supabase. If you want to bypass policies, you can use the [serverSupabaseServiceRole](/usage/services/serversupabaseservicerole).

## Authentication

The useSupabaseClient composable is providing all methods to manage authorization under `useSupabaseClient().auth`. For more details please see the [supabase-js auth documentation](https://supabase.com/docs/reference/javascript/auth-api). Here is an example for signing in and out:

::callout{icon="i-heroicons-light-bulb"}
If you want a full explanation on how to handle the authentication process, please read this [section](/get-started#handle-authentication).
::

```ts
<script setup lang="ts">
const supabase = useSupabaseClient()

const signInWithOAuth = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'github',
    options: {
      redirectTo: 'http://localhost:3000/confirm',
    },
  })
  if (error) console.log(error)
}

const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  if (error) console.log(error)
}
</script>
```

Please also take a look at [Get Started](/get-started) for the authorization flow.

## Database Request

Please check [Supabase](https://supabase.com/docs/reference/javascript/select) documentation to fully use the power of Supabase client.

Here is an example of a fetch using the `select` method with Nuxt 3 [useAsyncData](https://nuxt.com/docs/getting-started/data-fetching#useasyncdata) composable.

```vue
<script setup lang="ts">
const client = useSupabaseClient()

const { data: restaurant } = await useAsyncData('restaurant', async () => {
  const { data } = await client.from('restaurants').select('name, location').eq('name', 'My Restaurant Name').single()

  return data
})
</script>
```

## Realtime

Based on [Supabase Realtime](https://github.com/supabase/realtime), listen to changes in your PostgreSQL Database and broadcasts them over WebSockets.

To enable it, make sure you have turned on the [Realtime API](https://supabase.com/docs/guides/api#realtime-api) for your table.

Then, listen to changes directly in your vue page / component:

```vue
<script setup lang="ts">
import type { RealtimeChannel } from '@supabase/supabase-js'

const client = useSupabaseClient()

let realtimeChannel: RealtimeChannel

// Fetch collaborators and get the refresh method provided by useAsyncData
const { data: collaborators, refresh: refreshCollaborators } = await useAsyncData('collaborators', async () => {
  const { data } = await client.from('collaborators').select('name')
  return data
})

// Once page is mounted, listen to changes on the `collaborators` table and refresh collaborators when receiving event
onMounted(() => {
  // Real time listener for new workouts
  realtimeChannel = client.channel('public:collaborators').on(
    'postgres_changes',
    { event: '*', schema: 'public', table: 'collaborators' },
    () => refreshCollaborators()
  )

  realtimeChannel.subscribe()
})

  // Don't forget to unsubscribe when user left the page
onUnmounted(() => {
  client.removeChannel(realtimeChannel)
})
</script>
```

## Typescript

Database typings are passed to the client out of the box if the database generated types are found at `./types/database.types.ts` or [your configured types path](/get-started#types). Check Supabase [documentation](https://supabase.com/docs/reference/javascript/release-notes#typescript-support) for further information.

```shell
## Generate types from live database
supabase gen types typescript --project-id YourProjectId > types/database.types.ts

## Generate types when using local environment
supabase gen types typescript --local > types/database.types.ts
```

You can also pass Database typings to the client manually:

```vue
<script setup lang="ts">
import type { Database } from '~/types'
const client = useSupabaseClient<Database>()
</script>
```
