<script setup lang="ts">
definePageMeta({
  layout: 'auth',
})

const authStore = useAuthStore()

const form = ref({
  email: '',
  password: '',
})

const isLoading = ref(false)
const error = ref('')

const handleSubmit = async () => {
  isLoading.value = true
  error.value = ''
  try {
    await authStore.login(form.value)
  } catch (e: any) {
    error.value = e.message || 'Invalid email or password'
  } finally {
    isLoading.value = false
  }
}

useSeoMeta({
  title: 'Sign In | Premium Abrahamic Foods',
})
</script>

<template>
  <div class="bg-white dark:bg-dark-200 rounded-xl shadow-sm dark:shadow-black/50 p-8 border border-transparent dark:border-dark-600">
    <div class="text-center mb-8">
      <h1 class="font-heading text-2xl text-pif-black dark:text-white mb-2">Welcome Back</h1>
      <p class="text-gray-600 dark:text-gray-400">Sign in to your account</p>
    </div>

    <form class="space-y-4" @submit.prevent="handleSubmit">
      <div v-if="error" class="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm">
        {{ error }}
      </div>

      <PInput
        v-model="form.email"
        label="Email"
        type="email"
        placeholder="your@email.com"
        required
      />

      <PInput
        v-model="form.password"
        label="Password"
        type="password"
        placeholder="Enter your password"
        required
      />

      <div class="flex items-center justify-between text-sm">
        <label class="flex items-center gap-2">
          <input type="checkbox" class="rounded text-pif-green-dark dark:text-pif-gold focus:ring-pif-green dark:focus:ring-pif-gold dark:bg-dark-300 dark:border-dark-600" />
          <span class="text-gray-600 dark:text-gray-400">Remember me</span>
        </label>
        <NuxtLink to="/auth/forgot-password" class="text-pif-green-dark dark:text-pif-gold hover:underline">
          Forgot password?
        </NuxtLink>
      </div>

      <PButton type="submit" variant="primary" size="lg" block :loading="isLoading">
        Sign In
      </PButton>
    </form>

    <p class="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
      Don't have an account?
      <NuxtLink to="/auth/register" class="text-pif-green-dark dark:text-pif-gold font-medium hover:underline">
        Create one
      </NuxtLink>
    </p>
  </div>
</template>
