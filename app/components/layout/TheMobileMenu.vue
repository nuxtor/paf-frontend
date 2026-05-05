<script setup lang="ts">
import { NAV_LINKS, MAIN_CATEGORIES } from '~/utils/constants'

const uiStore = useUiStore()
const { getAssetUrl } = useAsset()

watch(
  () => uiStore.isMobileMenuOpen,
  (isOpen) => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  }
)

const handleNavClick = () => {
  uiStore.closeMobileMenu()
}
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="uiStore.isMobileMenuOpen"
        class="fixed inset-0 z-50 bg-black/50 lg:hidden"
        @click="uiStore.closeMobileMenu"
      />
    </Transition>

    <Transition
      enter-active-class="duration-300 ease-out"
      enter-from-class="-translate-x-full"
      enter-to-class="translate-x-0"
      leave-active-class="duration-200 ease-in"
      leave-from-class="translate-x-0"
      leave-to-class="-translate-x-full"
    >
      <div
        v-if="uiStore.isMobileMenuOpen"
        class="fixed inset-y-0 left-0 z-50 w-80 max-w-full bg-white dark:bg-pif-black shadow-xl lg:hidden"
      >
        <div class="flex flex-col h-full">
          <!-- Header -->
          <div class="flex items-center justify-between p-4 border-b border-gray-200 dark:border-dark-600">
            <NuxtLink to="/" @click="handleNavClick">
              <img
                :src="getAssetUrl('images/paf-logo-main.png')"
                alt="Premium Abrahimic Foods"
                class="h-10 dark:brightness-110"
              />
            </NuxtLink>
            <button
              class="p-2 hover:bg-gray-100 dark:hover:bg-dark-300 rounded-lg text-gray-600 dark:text-gray-400"
              @click="uiStore.closeMobileMenu"
            >
              <Icon name="heroicons:x-mark" class="w-6 h-6" />
            </button>
          </div>

          <!-- Navigation -->
          <nav class="flex-1 overflow-y-auto p-4">
            <!-- Categories -->
            <div class="mb-6">
              <h3 class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                Categories
              </h3>
              <ul class="space-y-1">
                <li v-for="category in MAIN_CATEGORIES" :key="category.slug">
                  <NuxtLink
                    :to="`/categories/${category.slug}`"
                    class="flex items-center gap-3 px-3 py-2 rounded-lg text-pif-black dark:text-white hover:bg-gray-100 dark:hover:bg-dark-300 transition-colors"
                    @click="handleNavClick"
                  >
                    <Icon name="heroicons:tag" class="w-5 h-5 text-pif-green dark:text-pif-gold" />
                    <span>{{ category.name }}</span>
                  </NuxtLink>
                </li>
              </ul>
            </div>

            <!-- Pages -->
            <div>
              <h3 class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                Pages
              </h3>
              <ul class="space-y-1">
                <li v-for="link in NAV_LINKS" :key="link.path">
                  <NuxtLink
                    :to="link.path"
                    class="block px-3 py-2 rounded-lg text-pif-black dark:text-white hover:bg-gray-100 dark:hover:bg-dark-300 transition-colors"
                    @click="handleNavClick"
                  >
                    {{ link.name }}
                  </NuxtLink>
                </li>
              </ul>
            </div>
          </nav>

          <!-- Footer -->
          <div class="p-4 border-t border-gray-200 dark:border-dark-600">
            <NuxtLink
              to="/auth/login"
              class="flex items-center justify-center gap-2 w-full py-2.5 bg-pif-green-dark dark:bg-pif-gold text-white dark:text-pif-black rounded-lg hover:bg-pif-green dark:hover:bg-pif-gold-light transition-colors"
              @click="handleNavClick"
            >
              <Icon name="heroicons:user" class="w-5 h-5" />
              <span>Sign In / Register</span>
            </NuxtLink>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
