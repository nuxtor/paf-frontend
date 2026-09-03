<script setup lang="ts">
const route = useRoute()
const authStore = useAuthStore()

const accountNavItems = [
  { name: 'Dashboard', path: '/account', icon: 'heroicons:home' },
  { name: 'Orders', path: '/account/orders', icon: 'heroicons:shopping-bag' },
  { name: 'Addresses', path: '/account/addresses', icon: 'heroicons:map-pin' },
  { name: 'Settings', path: '/account/settings', icon: 'heroicons:cog-6-tooth' },
]

const isActive = (path: string) => {
  if (path === '/account') {
    return route.path === path
  }
  return route.path.startsWith(path)
}

onMounted(() => {
  authStore.initAuth()
})
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <TheHeader />
    <TheMobileMenu />

    <main class="flex-1 bg-gray-50 dark:bg-pif-black">
      <div class="container py-8">
        <div class="flex flex-col lg:flex-row gap-8">
          <!-- Sidebar -->
          <aside class="lg:w-64 flex-shrink-0">
            <div class="bg-white dark:bg-dark-200 rounded-xl shadow-sm dark:shadow-black/50 p-4">
              <!-- User Info -->
              <div class="pb-4 mb-4 border-b border-gray-200 dark:border-dark-600">
                <p class="font-medium text-pif-black dark:text-white">
                  {{ authStore.fullName || 'Guest' }}
                </p>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  {{ authStore.user?.email || '' }}
                </p>
              </div>

              <!-- Navigation -->
              <nav class="space-y-1">
                <NuxtLink
                  v-for="item in accountNavItems"
                  :key="item.path"
                  :to="item.path"
                  :class="[
                    'flex items-center gap-3 px-3 py-2 rounded-lg transition-colors',
                    isActive(item.path)
                      ? 'bg-pif-green-dark text-white'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-300',
                  ]"
                >
                  <Icon :name="item.icon" class="w-5 h-5" />
                  <span>{{ item.name }}</span>
                </NuxtLink>
              </nav>

              <!-- Logout -->
              <div class="pt-4 mt-4 border-t border-gray-200 dark:border-dark-600">
                <button
                  class="flex items-center gap-3 w-full px-3 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  @click="authStore.logout"
                >
                  <Icon name="heroicons:arrow-right-on-rectangle" class="w-5 h-5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </aside>

          <!-- Main Content -->
          <div class="flex-1">
            <slot />
          </div>
        </div>
      </div>
    </main>

    <TheFooter />
  </div>
</template>
