<script setup lang="ts">
const { initTheme } = useTheme()
const authStore = useAuthStore()
const cmsStore = useCmsStore()

// Awaited directly rather than through useAsyncData: `nuxt generate` caches
// async data by key across the whole prerender, so a single app-level key runs
// its handler for the first route only, and every other page is built with an
// empty store — the logo and the nav then fall back to their bundled defaults.
// The store's own loaded flags do the deduping instead, per render.
await Promise.all([
  cmsStore.fetchSite(),
  cmsStore.fetchMenu('header'),
  cmsStore.fetchMenu('footer'),
  cmsStore.fetchMenu('mobile'),
])

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
