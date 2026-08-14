<script setup lang="ts">
definePageMeta({
  layout: 'auth',
})

const authStore = useAuthStore()

const form = ref({
  first_name: '',
  last_name: '',
  email: '',
  password: '',
  password_confirmation: '',
})

const isLoading = ref(false)
const error = ref('')

const handleSubmit = async () => {
  isLoading.value = true
  error.value = ''

  if (form.value.password !== form.value.password_confirmation) {
    error.value = 'Passwords do not match'
    isLoading.value = false
    return
  }

  try {
    await authStore.register(form.value)
  } catch (e: any) {
    error.value = e.message || 'Registration failed. Please try again.'
  } finally {
    isLoading.value = false
  }
}

useSeoMeta({
  title: 'Create Account | Premium Abrahamic Foods',
})
</script>

<template>
  <div class="bg-white dark:bg-dark-200 rounded-xl shadow-sm dark:shadow-black/50 p-8 border border-transparent dark:border-dark-600">
    <div class="text-center mb-8">
      <h1 class="font-heading text-2xl text-pif-black dark:text-white mb-2">Create Account</h1>
      <p class="text-gray-600 dark:text-gray-400">Join Premium Abrahamic Foods today</p>
    </div>

    <form class="space-y-4" @submit.prevent="handleSubmit">
      <div v-if="error" class="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm">
        {{ error }}
      </div>

      <div class="grid grid-cols-2 gap-4">
        <PInput
          v-model="form.first_name"
          label="First Name"
          placeholder="John"
          required
        />
        <PInput
          v-model="form.last_name"
          label="Last Name"
          placeholder="Doe"
          required
        />
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
        placeholder="Create a strong password"
        hint="Must be at least 8 characters with one uppercase and one number"
        required
      />

      <PInput
        v-model="form.password_confirmation"
        label="Confirm Password"
        type="password"
        placeholder="Confirm your password"
        required
      />

      <div class="text-sm">
        <label class="flex items-start gap-2">
          <input type="checkbox" required class="mt-1 rounded text-pif-green-dark dark:text-pif-gold focus:ring-pif-green dark:focus:ring-pif-gold dark:bg-dark-300 dark:border-dark-600" />
          <span class="text-gray-600 dark:text-gray-400">
            I agree to the
            <NuxtLink to="/terms" class="text-pif-green-dark dark:text-pif-gold hover:underline">
              Terms and Conditions
            </NuxtLink>
            and
            <NuxtLink to="/policies/privacy" class="text-pif-green-dark dark:text-pif-gold hover:underline">
              Privacy Policy
            </NuxtLink>
          </span>
        </label>
      </div>

      <PButton type="submit" variant="primary" size="lg" block :loading="isLoading">
        Create Account
      </PButton>
    </form>

    <p class="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
      Already have an account?
      <NuxtLink to="/auth/login" class="text-pif-green-dark dark:text-pif-gold font-medium hover:underline">
        Sign in
      </NuxtLink>
    </p>
  </div>
</template>
