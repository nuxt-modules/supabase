<script setup lang="ts">
const supabase = useSupabaseClient()
const user = useSupabaseUser()

const toast = useToast()

const sign = ref<'in' | 'up'>('in')

watchEffect(() => {
  if (user.value) {
    return navigateTo('/')
  }
})

const fields = [{
  name: 'email',
  type: 'text' as const,
  label: 'Email',
  placeholder: 'Enter your email',
  required: true,
}, {
  name: 'password',
  label: 'Password',
  type: 'password' as const,
  placeholder: 'Enter your password',
}]

const providers = [{
  label: 'GitHub',
  icon: 'i-simple-icons-github',
  onClick: async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: 'http://localhost:3000/confirm',
      },
    })
    if (error) displayError(error)
  },
}]

const signIn = async (email, password) => {
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  if (error) displayError(error)
}

const signUp = async (email, password) => {
  const { error } = await supabase.auth.signUp({
    email,
    password,
  })
  if (error) displayError(error)
  else {
    toast.add({
      title: 'Sign up successful',
      icon: 'i-lucide-check-circle',
      color: 'success',
    })
    await signIn(email, password)
  }
}

async function onSubmit(payload) {
  const email = payload.data.email
  const password = payload.data.password

  if (sign.value === 'in') await signIn(email, password)
  else await signUp(email, password)
}

const displayError = (error) => {
  toast.add({
    title: 'Error',
    description: error.message,
    icon: 'i-lucide-alert-circle',
    color: 'error',
  })
}
</script>

<template>
  <div class="h-screen flex items-center justify-center px-4">
    <UPageCard class="max-w-sm w-full">
      <UAuthForm
        :title="sign === 'in' ? 'Login' : 'Sign up'"
        icon="i-lucide-user"
        :fields="fields"
        :providers="providers"
        @submit="onSubmit"
      >
        <template
          #description
        >
          {{ sign === 'up' ? 'Already have an account?' : 'Don\'t have an account?' }}
          <UButton
            variant="link"
            class="p-0"
            @click="sign = sign === 'up' ? 'in' : 'up'"
          >
            {{ sign === 'in' ? 'Sign up' : 'Sign in' }}
          </UButton>.
        </template>
      </UAuthForm>
    </UPageCard>
  </div>
</template>
