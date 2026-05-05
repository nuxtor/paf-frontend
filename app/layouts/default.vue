<script setup lang="ts">
const authStore = useAuthStore()

onMounted(() => {
  authStore.initAuth()
})
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <TheHeader />
    <TheMobileMenu />

    <main class="flex-1">
      <slot />
    </main>

    <TheFooter />

    <CartDrawer />
    <ToastContainer />
  </div>
</template>
