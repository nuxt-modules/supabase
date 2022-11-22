<template>
  <div v-if="user">
    <h2>
      Authenticated as {{ user.user_metadata.full_name }}!
    </h2>
    <button @click="fetchMeFromServerRoute">
      Fetch me from server route !
    </button>
    <pre>
        {{ userFromServer }}
       </pre>
    <button @click="chooseMeAnotherName">
      Change my name !
    </button>
    <pre>
      {{ userFromComposable }}
    </pre>
    <NuxtLink to="/me-again" label="me">
      Go to new page to test token
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
import { Database } from '~~/types/database.types'

const client = useSupabaseClient<Database>('me')
const user = useSupabaseUser()
const userFromServer = ref(null)
const userFromComposable = ref(null)

const { data } = await useAsyncData('me', async () => {
  const { data } = await client.from('pushupers')
    .select('firstname, lastname, avatar, email')
    .eq('email', user.value.email)
    .single()

  return data
})

userFromComposable.value = data.value

const fetchMeFromServerRoute = async () => {
  const { data } = await useFetch('/api/me', { headers: useRequestHeaders(['cookie']), key: `me:${userFromComposable.value.firstname}` })

  userFromServer.value = data.value
}

const chooseMeAnotherName = async () => {
  const names = ['Billy', 'Bobby', 'Jimmy', 'Johnny']
  let newName

  do {
    newName = names[Math.floor(Math.random() * names.length)]
  } while (newName === userFromComposable.value.firstname)

  const newProfile = {
    ...userFromComposable.value,
    firstname: newName,
    user_id: user.value.id
  }

  const { error, data } = await client.from('pushupers').upsert(newProfile).select('firstname, lastname, avatar, email').single()

  if (error) {
    // eslint-disable-next-line no-console
    console.error(error.message)
  }

  userFromComposable.value = data
}
</script>
