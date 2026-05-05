<script setup lang="ts">
definePageMeta({
  layout: 'account',
})

const authStore = useAuthStore()

useSeoMeta({
  title: 'Account Settings | Premium Abrahimic Foods',
})

const form = ref({
  first_name: authStore.user?.first_name || '',
  last_name: authStore.user?.last_name || '',
  email: authStore.user?.email || '',
  phone: authStore.user?.phone || '',
})

const isLoading = ref(false)

const handleSubmit = async () => {
  isLoading.value = true
  try {
    await authStore.updateProfile(form.value)
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div>
    <h1 class="font-heading text-2xl text-pif-black mb-6">Account Settings</h1>

    <div class="space-y-6">
      <!-- Profile Information -->
      <PCard>
        <h2 class="font-heading text-lg text-pif-black mb-4">Profile Information</h2>
        <form class="space-y-4" @submit.prevent="handleSubmit">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <PInput v-model="form.first_name" label="First Name" required />
            <PInput v-model="form.last_name" label="Last Name" required />
            <PInput v-model="form.email" label="Email" type="email" required />
            <PInput v-model="form.phone" label="Phone" type="tel" />
          </div>
          <PButton type="submit" variant="primary" :loading="isLoading">
            Save Changes
          </PButton>
        </form>
      </PCard>

      <!-- Change Password -->
      <PCard>
        <h2 class="font-heading text-lg text-pif-black mb-4">Change Password</h2>
        <form class="space-y-4" @submit.prevent>
          <PInput label="Current Password" type="password" />
          <PInput
            label="New Password"
            type="password"
            hint="Must be at least 8 characters with one uppercase and one number"
          />
          <PInput label="Confirm New Password" type="password" />
          <PButton type="submit" variant="primary">
            Update Password
          </PButton>
        </form>
      </PCard>

      <!-- Delete Account -->
      <PCard>
        <h2 class="font-heading text-lg text-red-600 mb-4">Delete Account</h2>
        <p class="text-gray-600 mb-4">
          Once you delete your account, there is no going back. Please be certain.
        </p>
        <PButton variant="outline" class="!border-red-500 !text-red-500 hover:!bg-red-500 hover:!text-white">
          Delete Account
        </PButton>
      </PCard>
    </div>
  </div>
</template>
