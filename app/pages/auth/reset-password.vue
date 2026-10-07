<script setup lang="ts">
definePageMeta({
  layout: 'auth',
})

const route = useRoute()
const { apiFetch } = useApi()

// Filled from the emailed link on the client. The page is prerendered, so
// at build time there is no query string to read.
const token = ref('')
const email = ref('')
const linkChecked = ref(false)

const form = ref({
  password: '',
  password_confirmation: '',
})

const isLoading = ref(false)
const isDone = ref(false)
const error = ref('')

onMounted(() => {
  token.value = String(route.query.token ?? '')
  email.value = String(route.query.email ?? '')
  linkChecked.value = true

  // Take the token out of the address bar, so it does not linger in
  // history or get copied along with the URL.
  if (token.value) {
    window.history.replaceState(window.history.state, '', route.path)
  }
})

const hasValidLink = computed(() => !linkChecked.value || (token.value !== '' && email.value !== ''))

const handleSubmit = async () => {
  error.value = ''

  if (form.value.password.length < 8) {
    error.value = 'Your new password must be at least 8 characters.'
    return
  }

  if (form.value.password !== form.value.password_confirmation) {
    error.value = 'Passwords do not match'
    return
  }

  isLoading.value = true

  try {
    await apiFetch('/auth/reset-password', {
      method: 'POST',
      body: {
        token: token.value,
        email: email.value,
        ...form.value,
      },
    })
    isDone.value = true
  } catch (e: any) {
    const status = e?.response?.status
    const data = e?.response?._data

    if (status === 422 && data?.errors) {
      error.value = Object.values(data.errors).flat().join(' ')
    } else if (status === 429) {
      error.value = 'Too many attempts. Please wait a few minutes and try again.'
    } else {
      error.value = data?.message || 'Sorry, we could not reset your password just now. Please try again.'
    }
  } finally {
    isLoading.value = false
  }
}

useSeoMeta({
  title: 'Reset Password | Premium Abrahamic Foods',
  robots: 'noindex',
})

// The token is in the URL this page is opened with; keep it out of the
// Referer header sent to anything the page loads.
useHead({
  meta: [{ name: 'referrer', content: 'no-referrer' }],
})
</script>

<template>
  <div class="bg-white dark:bg-dark-200 rounded-xl shadow-sm dark:shadow-black/50 p-8 border border-transparent dark:border-dark-600">
    <!-- Success State -->
    <div v-if="isDone" class="text-center">
      <div class="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
        <Icon name="heroicons:check" class="w-8 h-8 text-green-600 dark:text-green-400" />
      </div>
      <h1 class="font-heading text-2xl text-pif-black dark:text-white mb-2">Password Reset</h1>
      <p class="text-gray-600 dark:text-gray-400 mb-6">
        Your password has been changed. You can now sign in with your new password.
      </p>
      <NuxtLink to="/auth/login" class="block">
        <PButton variant="primary" size="lg" block>
          Sign In
        </PButton>
      </NuxtLink>
    </div>

    <!-- Link missing its token or email -->
    <div v-else-if="!hasValidLink" class="text-center">
      <div class="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
        <Icon name="heroicons:exclamation-triangle" class="w-8 h-8 text-red-600 dark:text-red-400" />
      </div>
      <h1 class="font-heading text-2xl text-pif-black dark:text-white mb-2">Link Not Valid</h1>
      <p class="text-gray-600 dark:text-gray-400 mb-6">
        This password reset link is incomplete. Please use the link from your email, or request a new one.
      </p>
      <NuxtLink
        to="/auth/forgot-password"
        class="inline-block text-pif-green-dark dark:text-pif-gold font-medium hover:underline"
      >
        Request a new link
      </NuxtLink>
    </div>

    <!-- Form State -->
    <template v-else>
      <div class="text-center mb-8">
        <h1 class="font-heading text-2xl text-pif-black dark:text-white mb-2">Choose a New Password</h1>
        <p class="text-gray-600 dark:text-gray-400">
          <template v-if="email">For <strong class="text-pif-black dark:text-white">{{ email }}</strong></template>
          <template v-else>Enter your new password below.</template>
        </p>
      </div>

      <form class="space-y-4" @submit.prevent="handleSubmit">
        <div v-if="error" class="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm">
          {{ error }}
          <NuxtLink
            v-if="error.includes('expired')"
            to="/auth/forgot-password"
            class="block mt-2 font-medium underline"
          >
            Request a new link
          </NuxtLink>
        </div>

        <PInput
          v-model="form.password"
          label="New Password"
          type="password"
          placeholder="At least 8 characters"
          autocomplete="new-password"
          required
        />

        <PInput
          v-model="form.password_confirmation"
          label="Confirm New Password"
          type="password"
          placeholder="Type it again"
          autocomplete="new-password"
          required
        />

        <PButton type="submit" variant="primary" size="lg" block :loading="isLoading">
          Reset Password
        </PButton>
      </form>

      <p class="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
        Remembered it?
        <NuxtLink to="/auth/login" class="text-pif-green-dark dark:text-pif-gold font-medium hover:underline">
          Sign in
        </NuxtLink>
      </p>
    </template>
  </div>
</template>
