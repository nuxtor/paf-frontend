<script setup lang="ts">
const { getAssetUrl } = useAsset()
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-pif-black flex flex-col">
    <!-- Checkout Header -->
    <header class="bg-white dark:bg-dark-200 border-b border-gray-200 dark:border-dark-600">
      <div class="container py-4">
        <div class="flex items-center justify-between">
          <NuxtLink to="/" class="inline-block">
            <img
              :src="getAssetUrl('images/paf-logo-main.png')"
              alt="Premium Abrahimic Foods"
              class="h-10"
            />
          </NuxtLink>

          <div class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Icon name="heroicons:lock-closed" class="w-4 h-4" />
            <span>Secure Checkout</span>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-1">
      <slot />
    </main>

    <!-- Checkout Footer -->
    <footer class="bg-white dark:bg-dark-200 border-t border-gray-200 dark:border-dark-600 py-6">
      <div class="container">
        <div class="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500 dark:text-gray-400">
          <div class="flex items-center gap-4">
            <span>We accept:</span>
            <div class="flex items-center gap-2">
              <Icon name="logos:visa" class="h-6 w-auto" />
              <Icon name="logos:mastercard" class="h-6 w-auto" />
              <Icon name="logos:amex" class="h-6 w-auto" />
            </div>
          </div>
          <div class="flex items-center gap-4">
            <NuxtLink to="/policies/privacy" class="hover:text-pif-green-dark dark:hover:text-pif-gold">
              Privacy Policy
            </NuxtLink>
            <NuxtLink to="/terms" class="hover:text-pif-green-dark dark:hover:text-pif-gold">
              Terms & Conditions
            </NuxtLink>
          </div>
        </div>
      </div>
    </footer>

    <ToastContainer />
  </div>
</template>
