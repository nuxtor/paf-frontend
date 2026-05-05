<script setup lang="ts">
const { getAssetUrl } = useAsset()
</script>

<template>
  <div class="min-h-screen bg-pif-cream dark:bg-pif-black flex flex-col">
    <!-- Simple Header -->
    <header class="bg-white dark:bg-dark-100 shadow-sm dark:shadow-black/50">
      <div class="container py-4">
        <NuxtLink to="/" class="inline-block">
          <img
            :src="getAssetUrl('images/paf-logo-main.png')"
            alt="Premium Abrahimic Foods"
            class="h-12 dark:brightness-110"
          />
        </NuxtLink>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-1 flex items-center justify-center p-4">
      <div class="w-full max-w-md">
        <slot />
      </div>
    </main>

    <!-- Simple Footer -->
    <footer class="py-4 text-center text-sm text-gray-500 dark:text-gray-400">
      <p>&copy; {{ new Date().getFullYear() }} Premium Abrahimic Foods. All rights reserved.</p>
    </footer>
  </div>
</template>
