<script setup lang="ts">
definePageMeta({
  layout: 'auth',
})

const { apiFetch } = useApi()

const email = ref('')
const isLoading = ref(false)
const isSubmitted = ref(false)
const error = ref('')

const handleSubmit = async () => {
  isLoading.value = true
  error.value = ''

  try {
    // The API answers the same way whether or not the address has an
    // account, so "check your email" is all this page can honestly say.
    await apiFetch('/auth/forgot-password', {
      method: 'POST',
      body: { email: email.value },
    })
    isSubmitted.value = true
  } catch (e: any) {
    const status = e?.response?.status
    const data = e?.response?._data

    if (status === 422 && data?.errors) {
      error.value = Object.values(data.errors).flat().join(' ')
    } else if (status === 429) {
      error.value = 'Too many requests. Please wait a few minutes and try again.'
    } else {
      error.value = 'Sorry, we could not send the reset link just now. Please try again.'
    }
  } finally {
    isLoading.value = false
  }
}

useSeoMeta({
  title: 'Forgot Password | Premium Abrahamic Foods',
})
</script>

<template>
  <div class="bg-white dark:bg-dark-200 rounded-xl shadow-sm dark:shadow-black/50 p-8 border border-transparent dark:border-dark-600">
    <!-- Success State -->
    <div v-if="isSubmitted" class="text-center">
      <div class="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
        <Icon name="heroicons:envelope" class="w-8 h-8 text-green-600 dark:text-green-400" />
      </div>
      <h1 class="font-heading text-2xl text-pif-black dark:text-white mb-2">Check Your Email</h1>
      <p class="text-gray-600 dark:text-gray-400 mb-2">
        If there is an account for <strong class="text-pif-black dark:text-white">{{ email }}</strong>,
        we've sent it a link to reset your password.
      </p>
      <p class="text-sm text-gray-500 dark:text-gray-400 mb-6">
        The link expires in 60 minutes. If it hasn't arrived in a few minutes, check your junk folder.
      </p>
      <NuxtLink
        to="/auth/login"
        class="inline-block text-pif-green-dark dark:text-pif-gold font-medium hover:underline"
      >
        Back to Sign In
      </NuxtLink>
    </div>

    <!-- Form State -->
    <template v-else>
      <div class="text-center mb-8">
        <h1 class="font-heading text-2xl text-pif-black dark:text-white mb-2">Forgot Password?</h1>
        <p class="text-gray-600 dark:text-gray-400">
          Enter your email and we'll send you a link to reset your password.
        </p>
      </div>

      <form class="space-y-4" @submit.prevent="handleSubmit">
        <div v-if="error" class="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm">
          {{ error }}
        </div>

        <PInput
          v-model="email"
          label="Email"
          type="email"
          placeholder="your@email.com"
          required
        />

        <PButton type="submit" variant="primary" size="lg" block :loading="isLoading">
          Send Reset Link
        </PButton>
      </form>

      <p class="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
        Remember your password?
        <NuxtLink to="/auth/login" class="text-pif-green-dark dark:text-pif-gold font-medium hover:underline">
          Sign in
        </NuxtLink>
      </p>
    </template>
  </div>
</template>
