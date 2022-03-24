<template>
  <div class="w-full my-[50px]">
    <h1 class="mb-12 text-6xl font-bold u-text-white">
      Todo List.
    </h1>
    <form class="flex gap-2 my-2" @submit.prevent="addTask">
      <UInput
        v-model="newTask"
        class="w-full"
        size="xl"
        variant="white"
        type="text"
        name="newTask"
        placeholder="Make a coffee"
        autofocus
        :loading="loading"
      />
      <UButton type="submit" variant="white">
        Add
      </UButton>
    </form>
    <UCard v-if="tasks.length > 0" body-class="px-6 py-2">
      <ul>
        <li
          v-for="(task, index) of tasks"
          :key="`task${index}`"
          :class="{ 'border-b': index !== tasks.length - 1 }"
          class="border-gray-200 divide-y divide-gray-200"
        >
          <div class="py-2">
            <UFormGroup :label-class="`block font-medium u-text-gray-700 ${task.completed && 'line-through'}`" wrapper-class="flex items-center justify-between w-full" :label="task.title" :name="`task${index}`">
              <div class="flex items-center justify-between">
                <UToggle
                  v-model="task.completed"
                  :name="`task${index}`"
                  icon-off="heroicons-solid:x"
                  icon-on="heroicons-solid:check"
                  @click="updateTask(task)"
                />
                <UButton
                  class="ml-3 text-red-600"
                  size="sm"
                  variant="transparent"
                  icon="heroicons-outline:trash"
                  @click="removeTask(task)"
                />
              </div>
            </UFormGroup>
          </div>
        </li>
      </ul>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { Task } from '~/types/tasks'

definePageMeta({
  middleware: 'auth'
})

const client = useSupabaseClient()
const user = useSupabaseUser()
const loading = ref(null)
const newTask = ref('')

const { data: { value: { data: tasks } } } = await useAsyncData('tasks', async () => {
  return await client.from<Task>('tasks')
    .select('id, title, completed')
    .eq('user', user.value.id)
})

async function addTask () {
  if (newTask.value.length === 0) {
    return
  }

  loading.value = true
  const { error, data } = await client.from<Task>('tasks').upsert({
    user: user.value.id,
    title: newTask.value,
    completed: false
  })

  if (error) {
    return alert(`Oups ! Something went wrong ! Error: ${JSON.stringify(error)}`)
  }

  tasks.push(data[0])
  newTask.value = ''
  loading.value = false
}

async function updateTask (task: Task) {
  const { error } = await client.from<Task>('tasks').update({ completed: task.completed }).match({ id: task.id })

  if (error) {
    return alert(`Oups ! Something went wrong ! Error: ${JSON.stringify(error)}`)
  }
}

async function removeTask (task: Task) {
  const { error } = await client.from<Task>('tasks').delete().match({ id: task.id })

  if (error) {
    return alert(`Oups ! Something went wrong ! Error: ${JSON.stringify(error)}`)
  }

  tasks.splice(tasks.indexOf(task), 1)
}
</script>
