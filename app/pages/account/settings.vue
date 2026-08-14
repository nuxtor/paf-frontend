<script setup lang="ts">
definePageMeta({
  layout: 'account',
})

const authStore = useAuthStore()

useSeoMeta({
  title: 'Account Settings | Premium Abrahamic Foods',
})

const profileForm = ref({
  first_name: authStore.user?.first_name || '',
  last_name: authStore.user?.last_name || '',
  email: authStore.user?.email || '',
  phone: authStore.user?.phone || '',
})

watch(
  () => authStore.user,
  (u) => {
    if (u) {
      profileForm.value = {
        first_name: u.first_name || '',
        last_name: u.last_name || '',
        email: u.email || '',
        phone: u.phone || '',
      }
    }
  },
  { immediate: true }
)

const isSavingProfile = ref(false)
const handleProfileSubmit = async () => {
  isSavingProfile.value = true
  try {
    await authStore.updateProfile(profileForm.value)
  } catch {
    // toast handled by store
  } finally {
    isSavingProfile.value = false
  }
}

const passwordForm = ref({
  current_password: '',
  password: '',
  password_confirmation: '',
})
const passwordError = ref('')
const isSavingPassword = ref(false)

const handlePasswordSubmit = async () => {
  passwordError.value = ''
  if (passwordForm.value.password !== passwordForm.value.password_confirmation) {
    passwordError.value = 'New passwords do not match'
    return
  }
  if (passwordForm.value.password.length < 8) {
    passwordError.value = 'New password must be at least 8 characters'
    return
  }

  isSavingPassword.value = true
  try {
    await authStore.changePassword(passwordForm.value)
    passwordForm.value = {
      current_password: '',
      password: '',
      password_confirmation: '',
    }
  } catch (e: any) {
    passwordError.value = e?.data?.message || 'Failed to update password'
  } finally {
    isSavingPassword.value = false
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
        <form class="space-y-4" @submit.prevent="handleProfileSubmit">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <PInput v-model="profileForm.first_name" label="First Name" required />
            <PInput v-model="profileForm.last_name" label="Last Name" required />
            <PInput v-model="profileForm.email" label="Email" type="email" required />
            <PInput v-model="profileForm.phone" label="Phone" type="tel" />
          </div>
          <PButton type="submit" variant="primary" :loading="isSavingProfile">
            Save Changes
          </PButton>
        </form>
      </PCard>

      <!-- Change Password -->
      <PCard>
        <h2 class="font-heading text-lg text-pif-black mb-4">Change Password</h2>
        <form class="space-y-4" @submit.prevent="handlePasswordSubmit">
          <div v-if="passwordError" class="p-3 bg-red-50 text-red-600 rounded-lg text-sm">
            {{ passwordError }}
          </div>
          <PInput
            v-model="passwordForm.current_password"
            label="Current Password"
            type="password"
            required
          />
          <PInput
            v-model="passwordForm.password"
            label="New Password"
            type="password"
            hint="Must be at least 8 characters"
            required
          />
          <PInput
            v-model="passwordForm.password_confirmation"
            label="Confirm New Password"
            type="password"
            required
          />
          <PButton type="submit" variant="primary" :loading="isSavingPassword">
            Update Password
          </PButton>
        </form>
      </PCard>
    </div>
  </div>
</template>
