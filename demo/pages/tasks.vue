<script setup lang="ts">
import { Task } from '~/types/tasks'

// TODO: prevent accessing when guest

const client = useSupabaseClient()
const user = useSupabaseUser()
const loading = ref(null)
const newTask = ref('')

// TODO: fetch tasks for user with SSR & hydration
const tasks = ref([])

async function addTask () {
  if (newTask.value.trim().length === 0) {
    return
  }
  loading.value = true

  const { data } = await client.from<Task>('tasks').upsert({
    user: user.value.id,
    title: newTask.value,
    completed: false
  })
  tasks.value.push(data[0])
  newTask.value = ''
  loading.value = false
}
const completeTask = async (task: Task) => {
  await client.from<Task>('tasks').update({ completed: task.completed }).match({ id: task.id })
}
const removeTask = async (task: Task) => {
  tasks.value = tasks.value.filter(t => t.id !== task.id)
  await client.from<Task>('tasks').delete().match({ id: task.id })
}
</script>

<template>
  <div class="w-full my-[50px]">
    <h1 class="mb-12 text-6xl font-bold u-text-white">
      Todo List.
    </h1>
    <form class="flex gap-2 my-2" @submit.prevent="addTask">
      <UInput
        v-model="newTask"
        :loading="loading"
        class="w-full"
        size="xl"
        variant="white"
        type="text"
        name="newTask"
        placeholder="Make a coffee"
        autofocus
        autocomplete="off"
      />
      <UButton type="submit" variant="white">
        Add
      </UButton>
    </form>
    <UCard v-if="tasks.length > 0" body-class="px-6 py-2 overflow-hidden">
      <ul>
        <li
          v-for="task of tasks"
          :key="task.id"
          class="border-b border-gray-200 divide-y divide-gray-200"
        >
          <div class="py-2">
            <UFormGroup
              :label-class="`block font-medium ${task.completed ? 'line-through u-text-gray-500' : 'u-text-gray-700'}`"
              :label="task.title"
              :name="String(task.id)"
              wrapper-class="flex items-center justify-between w-full"
            >
              <div class="flex items-center justify-between">
                <UToggle
                  v-model="task.completed"
                  :name="String(task.id)"
                  icon-off="heroicons-solid:x"
                  icon-on="heroicons-solid:check"
                  @click="completeTask(task)"
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

<style lang="postcss">
ul > li:last-child {
  @apply border-b-0;
}
</style>
