<script setup lang="ts">
definePageMeta({
  layout: 'auth',
})

const email = ref('')
const isLoading = ref(false)
const isSubmitted = ref(false)
const error = ref('')

const handleSubmit = async () => {
  isLoading.value = true
  error.value = ''
  try {
    // TODO: Implement API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    isSubmitted.value = true
  } catch (e: any) {
    error.value = e.message || 'Failed to send reset email'
  } finally {
    isLoading.value = false
  }
}

useSeoMeta({
  title: 'Forgot Password | Premium Abrahimic Foods',
})
</script>

<template>
  <div class="bg-white rounded-xl shadow-sm p-8">
    <!-- Success State -->
    <div v-if="isSubmitted" class="text-center">
      <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <Icon name="heroicons:envelope" class="w-8 h-8 text-green-600" />
      </div>
      <h1 class="font-heading text-2xl text-pif-black mb-2">Check Your Email</h1>
      <p class="text-gray-600 mb-6">
        We've sent a password reset link to <strong>{{ email }}</strong>
      </p>
      <NuxtLink
        to="/auth/login"
        class="inline-block text-pif-green-dark font-medium hover:underline"
      >
        Back to Sign In
      </NuxtLink>
    </div>

    <!-- Form State -->
    <template v-else>
      <div class="text-center mb-8">
        <h1 class="font-heading text-2xl text-pif-black mb-2">Forgot Password?</h1>
        <p class="text-gray-600">
          Enter your email and we'll send you a link to reset your password.
        </p>
      </div>

      <form class="space-y-4" @submit.prevent="handleSubmit">
        <div v-if="error" class="p-4 bg-red-50 text-red-600 rounded-lg text-sm">
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

      <p class="text-center text-sm text-gray-600 mt-6">
        Remember your password?
        <NuxtLink to="/auth/login" class="text-pif-green-dark font-medium hover:underline">
          Sign in
        </NuxtLink>
      </p>
    </template>
  </div>
</template>
