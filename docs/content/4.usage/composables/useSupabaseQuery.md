---
title: useSupabaseQuery
description: Abstraction around the Supabase select API similar to useAsyncData
---

This composable is using [postgres-js](https://github.com/supabase/postgrest-js) under the hood.

## Usage

The useSupabaseQuery composable is wrapping the methods and return types of `useSupabaseClient().schema('...').from('...').select('...')`. For a more convinient developer experience similar to using useAsyncData.

```vue
<script setup lang="ts">
  const { data, count, error, status, loadMore } = await useSupabaseQuery(
    'objects',
    '*',
    filter => filter.eq('id', 'example'),
    {count: 'exact', single: false, limit: 10, schema: 'storage'}
  )
</script>
```
## Options
### Count
When using `{count: 'exact' | 'estimated' | 'planned'}` an additional count ref will be returned with a number.
### Single
When `single: true` .single() is automatically called, and data is properly typed for a single result instead of an Array
### Limit
When specifying a `limit`, an additional loadMore object is returned which will make an additional request using `.range(data.value.length, limit)`, and push it to `data.value`
### Schema
A schema can be provied, although `public` is already selected as the default.
## Typescript

Database typings are handled automatically.

You can also pass Database typings and Schema manually:

```vue
<script setup lang="ts">
   const { data } = await useSupabaseQuery<Database>('table', '*', filter => filter.eq('id', 'example'), {count: 'exact', single: true})
</script>
```
