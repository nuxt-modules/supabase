import type { PostgrestError, PostgrestFilterBuilder, PostgrestTransformBuilder, UnstableGetResult } from '@supabase/postgrest-js'
import type { GenericSchema, GenericTable, GenericView } from '@supabase/supabase-js/dist/module/lib/types'
import type { AsyncDataRequestStatus } from 'nuxt/app'
import { reactive, toRefs, watchEffect, type Ref } from 'vue'
import { useNuxtApp, useSupabaseClient } from '#imports'
import type { Database, Database as ImportedDB } from '#build/types/supabase-database'

type _StrippedPostgrestFilterBuilder<Schema extends GenericSchema, Row extends Record<string, unknown>, Result, RelationName = unknown, Relationships = unknown> = Omit<PostgrestFilterBuilder< Schema, Row, Result, RelationName, Relationships>, Exclude<keyof PostgrestTransformBuilder<Schema, Row, Result, RelationName, Relationships>, 'order' | 'range' | 'limit'>>

type StrippedPostgrestFilterBuilder<Schema extends GenericSchema, Row extends Record<string, unknown>, Result, RelationName = unknown, Relationships = unknown > = {
  [K in keyof _StrippedPostgrestFilterBuilder<Schema, Row, Result, RelationName, Relationships>]: PostgrestFilterBuilder<Schema, Row, Result, RelationName, Relationships>[K]
}

type FilterFn<Schema extends GenericSchema = GenericSchema, Row extends Record<string, unknown> = Record<string, unknown>, Result = unknown, RelationName = unknown, Relationships = unknown> = (filter: StrippedPostgrestFilterBuilder<Schema, Row, Result, RelationName, Relationships>) => StrippedPostgrestFilterBuilder<Schema, Row, Result, RelationName, Relationships>
// export declare interface useSupabaseSelect<_db extends Record<string, GenericSchema> = ImportedDB> extends useSupabaseSelectSchema<_db['public']> {
//   schema<_schema extends keyof _db>(schema: _schema): useSupabaseSelectSchema<_db[_schema]>
// }

// interface useSupabaseSelectSchema<
//   _schema extends GenericSchema,
// > {
//   <
//     _relation extends keyof (_schema['Views'] & _schema['Tables']) = keyof (_schema['Views'] & _schema['Tables']),
//     _relationTableOrView extends GenericTable | GenericView = _relation extends keyof _schema['Tables'] ? _schema['Tables'][_relation] : _relation extends keyof _schema['Views'] ? _schema['Views'][_relation] : never,
//     _query extends string = '*',
//     _result = UnstableGetResult<_schema, _relationTableOrView['Row'], _relation, _relationTableOrView['Relationships'], _query>,
//     _builder = StrippedPostgrestFilterBuilder<_schema, _relationTableOrView['Row'], _result, _relationTableOrView, _relationTableOrView['Relationships'] >,
//     _count extends 'exact' | 'planned' | 'estimated' | undefined = undefined,
//     _single extends boolean = false,
//     _returning = useSupabaseSelectReturns<_single extends true ? _result : _result[]> & _count extends undefined ? never : { count: Ref<number> } & _single extends true ? never : { loadMore(count: number): Promise<void> },
//   >(relation: _relation, query: _query, options?: {
//     filter?: (builder: _builder) => _builder
//     count?: _count
//     single?: _single
//   }): _returning & Promise<_returning>
// }

interface useSupabaseSelectReturns<_result> {
  data: Ref<_result>
  error: Ref<PostgrestError>
  status: Ref<AsyncDataRequestStatus>
}

export function useSupabaseSelect<
  _db extends Record<string, GenericSchema> = ImportedDB,
  _schema extends GenericSchema = _db['public'],
  const _relation extends string = (string & keyof _schema['Views']) | (string & keyof _schema['Tables']),
  _relationTableOrView extends GenericTable | GenericView = _relation extends keyof _schema['Tables'] ? _schema['Tables'][_relation] : _relation extends keyof _schema['Views'] ? _schema['Views'][_relation] : never,
  _result = UnstableGetResult<_schema, _relationTableOrView['Row'], _relation, _relationTableOrView['Relationships'], '*'>,
  _returning = useSupabaseSelectReturns<_result[]> & { loadMore(count: number): Promise<void> },
>(relation: _relation): _returning & Promise<_returning>

export function useSupabaseSelect<
  _db extends Record<string, GenericSchema> = ImportedDB,
  const _schema extends GenericSchema = _db['public'],
  const _relation extends string = (string & keyof _schema['Views']) | (string & keyof _schema['Tables']),
  _relationTableOrView extends GenericTable | GenericView = _relation extends keyof _schema['Tables'] ? _schema['Tables'][_relation] : _relation extends keyof _schema['Views'] ? _schema['Views'][_relation] : never,
  _query extends string = string,
  _result = UnstableGetResult<_schema, _relationTableOrView['Row'], _relation, _relationTableOrView['Relationships'], _query>,
  _returning = useSupabaseSelectReturns<_result[]> & { loadMore(count: number): Promise<void> },
>(relation: _relation, query: _query): _returning & Promise<_returning>

export function useSupabaseSelect<
  _db extends Record<string, GenericSchema> = ImportedDB,
  const _schema extends GenericSchema = _db['public'],
  const _relation extends string = (string & keyof _schema['Views']) | (string & keyof _schema['Tables']),
  _relationTableOrView extends GenericTable | GenericView = _relation extends keyof _schema['Tables'] ? _schema['Tables'][_relation] : _relation extends keyof _schema['Views'] ? _schema['Views'][_relation] : never,
  const _query extends string = string,
  _result = UnstableGetResult<_schema, _relationTableOrView['Row'], _relation, _relationTableOrView['Relationships'], _query>,
  _count extends 'exact' | 'planned' | 'estimated' | undefined = 'exact' | 'planned' | 'estimated' | undefined,
  _single extends boolean = boolean,
  _returning = (useSupabaseSelectReturns<_single extends true ? _result : _result[]>) & { count: _count extends undefined ? never : Ref<number>, loadMore: _single extends true ? never : (count: number) => Promise<void> } ,
>(relation: _relation, query: _query, options?: {
  filter?: FilterFn<_schema, _relationTableOrView['Row'], _result, _relationTableOrView, _relationTableOrView['Relationships'] >
  count?: _count
  single?: _single
}): _returning & Promise<_returning>

export function useSupabaseSelect(relation: string, query: string = '*', { count, single, filter }: { filter?: FilterFn, count?: 'exact' | 'planned' | 'estimated', single?: boolean } = {}) {
  return _interal({ count, single, relation, query, schema: 'public', filter })
}

export function useSupabaseSelectSchema<
  _db extends Record<string, GenericSchema> = ImportedDB,
  const _schema_name extends string = string & keyof _db,
  const _schema extends GenericSchema = _db[_schema_name],
>(schema: _schema_name): typeof useSupabaseSelect<_db, _schema> {
  return function useSupabaseSelect<_db, _schema>(relation: string, query: string = '*', { count, single, filter }: { filter?: FilterFn, count?: 'exact' | 'planned' | 'estimated', single?: boolean } = {}) {
    return _interal({ count, single, relation, query, schema, filter })
  }
}

function _interal<
  _returning = {
    data: Ref<unknown[] | unknown>
    error: Ref<PostgrestError>
    status: Ref<AsyncDataRequestStatus>
    count?: Ref<number>
    loadMore?: (() => Promise<void>)
  },
>({
  schema,
  relation,
  filter,
  query,
  single,
  count,
}: {
  schema: string
  relation: string
  query: string
  filter?: FilterFn
  single?: boolean
  count?: 'exact' | 'planned' | 'estimated'
}): Promise<_returning> & _returning {
  const nuxtApp = useNuxtApp()
  const client = useSupabaseClient<Database>()

  const asyncData = reactive({ status: 'idle', data: null, error: null })
  const returning = toRefs(asyncData)

  function makeRequest() {
    let request = schema
      ? client.schema(schema).from(relation).select(query, { count })
      : client.from(relation).select(query, { count })
    if (filter) request = filter(request) // as unknown as StrippedPostgrestFilterBuilder<Schema, Relation['Row'], ResultOne[], RelationName, Relation['Relationships']>) as unknown as PostgrestTransformBuilder<Schema, Relation['Row'], ResultOne[], RelationName, Relation['Relationships']>
    if (single) request.single()
    return request
  }

  const req = makeRequest()
  // @ts-expect-error Property 'url' is protected and only accessible within class 'PostgrestBuilder<Result>' and its subclasses.
  const key = req.url.pathname + req.url.search
  if (import.meta.browser) {
    // Watch for changes
    let reqInProgress: ReturnType<typeof handleRequest>
    watchEffect(async () => {
      if (reqInProgress) await reqInProgress
      reqInProgress = handleRequest(makeRequest())
    })

    // loadMore
    if (limit && !single)
      Object.assign(returning, {
        async loadMore() {
          if (!Array.isArray(asyncData.data)) throw new Error('asyncData.data is not an array, so more values cannot be loaded into it.')
          asyncData.status = 'pending'
          const { data, error, count } = await makeRequest().range(asyncData.data.length, asyncData.data.length + limit)
          Object.assign(asyncData, { error, count })
          asyncData.data.push(...data)
          asyncData.status = error ? 'error' : 'success'
        },
      })
  }

  async function handleRequest(request: ReturnType<typeof makeRequest>) {
    asyncData.status = 'pending'
    // @ts-expect-error Property 'url' is protected and only accessible within class 'PostgrestBuilder<Result>' and its subclasses.
    const { data, error, count } = nuxtApp.payload.data[req.url.pathname + req.url.search] || await request
    Object.assign(asyncData, { data, error, count })
    asyncData.status = error ? 'error' : 'success'
    return returning
  }

  const promise = new Promise<typeof returning>(resolve => handleRequest(req).then(resolve))

  if (import.meta.server) {
    promise.finally(() => nuxtApp.payload.data[key] ??= returning)
    nuxtApp.hook('app:created', async () => {
      await promise
    })
  }

  return Object.assign(promise, returning)
}

// immediate?: AsyncDataOptions<unknown>['immediate']
// deep?: AsyncDataOptions<unknown>['deep']
// lazy?: AsyncDataOptions<unknown>['lazy']
// server?: AsyncDataOptions<unknown>['server']
// watch?: AsyncDataOptions<unknown>['watch']
