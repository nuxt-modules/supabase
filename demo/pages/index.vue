<script setup lang="ts">
import type { Database } from '~~/types/database.types'

const client = useSupabaseClient()
const user = useSupabaseUser()
const toast = useToast()

const tasksFromServer = ref()
const isModalOpen = ref(false)
const loading = ref(false)
const newTask = ref('')

const { data: tasks } = await useAsyncData('tasks', async () => {
  const { data } = await client.from('tasks').select('*').eq('user', user.value!.id).order('created_at')

  return data ?? []
}, { default: () => [] })

async function addTask() {
  if (newTask.value.trim().length === 0) return

  loading.value = true

  const { data, error } = await client.from('tasks').upsert({
    user: user.value!.id,
    title: newTask.value,
    completed: false,
  })
    .select('*')
    .single()

  if (error) {
    toast.add({
      title: 'Error',
      description: error.message,
      color: 'error',
    })
  }

  if (data) {
    tasks.value = [...tasks.value, data]
  }

  newTask.value = ''
  loading.value = false
}

const completeTask = async (task: Database['public']['Tables']['tasks']['Row']) => {
  await client.from('tasks').update({ completed: task.completed }).match({ id: task.id })
  tasks.value = tasks.value.map(t => t.id === task.id ? task : t)
}

const removeTask = async (task: Database['public']['Tables']['tasks']['Row']) => {
  tasks.value = tasks.value.filter(t => t.id !== task.id)
  await client.from('tasks').delete().match({ id: task.id })
}

const fetchTasksFromServerRoute = async () => {
  const { data } = await useFetch('/api/tasks', { headers: useRequestHeaders(['cookie']), key: 'tasks-from-server' })

  tasksFromServer.value = data
  isModalOpen.value = true
}
</script>

<template>
  <UContainer>
    <UPageSection
      title="Todo List."
      description="Demo of a simple todo list app using Nuxt and Supabase."
      headline="Nuxt x Supabase"
    >
      <div class="flex justify-center items-center">
        <div class="flex flex-col gap-4 w-xl">
          <div class="flex gap-2">
            <UInput
              v-model="newTask"
              :loading="loading"
              class="w-full"
              size="xl"
              variant="subtle"
              placeholder="Make a coffee"
              autofocus
              @keyup.enter="addTask"
            />
            <UButton
              icon="i-lucide-plus"
              trailing
              :loading="loading"
              @click="addTask"
            >
              Add
            </UButton>
          </div>
          <div v-if="tasks.length > 0">
            <UCard variant="subtle">
              <ul>
                <li
                  v-for="task of tasks"
                  :key="task.id"
                  class="border-b border-muted last:border-b-0 py-3 first:pt-0 last:pb-0"
                >
                  <div class="flex items-center justify-between gap-2 min-w-0">
                    <span
                      class="truncate"
                      :class="task.completed ? 'line-through text-muted' : ''"
                    >
                      {{ task.title }}
                    </span>

                    <div class="flex items-center gap-2">
                      <USwitch
                        v-model="task.completed"
                        unchecked-icon="i-lucide-x"
                        checked-icon="i-lucide-check"
                        size="lg"
                        @update:model-value="completeTask(task)"
                      />
                      <UButton
                        variant="link"
                        icon="i-lucide-trash"
                        color="neutral"
                        @click="removeTask(task)"
                      />
                    </div>
                  </div>
                </li>
              </ul>
            </UCard>
            <div class="flex justify-end mt-4">
              <UButton
                label="Fetch tasks from server route"
                color="neutral"
                variant="link"
                @click="fetchTasksFromServerRoute"
              />
            </div>
          </div>
        </div>
      </div>
    </UPageSection>

    <UModal v-model:open="isModalOpen">
      <template #content>
        <pre>{{ tasksFromServer }}</pre>
      </template>
    </UModal>
  </UContainer>
</template>
