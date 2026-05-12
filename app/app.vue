<script setup lang="ts">
const { initTheme } = useTheme()
const authStore = useAuthStore()
const cmsStore = useCmsStore()

await useAsyncData('cms-menus', async () => {
  await Promise.all([
    cmsStore.fetchMenu('header'),
    cmsStore.fetchMenu('footer'),
    cmsStore.fetchMenu('mobile'),
  ])
  return true
})

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
