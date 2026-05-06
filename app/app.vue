<script setup lang="ts">
const { initTheme } = useTheme()
const authStore = useAuthStore()

onMounted(() => {
  initTheme()
  authStore.initAuth()
})
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
