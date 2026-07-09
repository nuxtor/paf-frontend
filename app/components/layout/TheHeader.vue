<script setup lang="ts">
import { NAV_LINKS, MAIN_CATEGORIES } from '~/utils/constants'
import type { CmsMenuItem } from '~/types/cms'

const cartStore = useCartStore()
const uiStore = useUiStore()
const cmsStore = useCmsStore()
const { isDark, toggleTheme } = useTheme()

const isScrolled = ref(false)
const isMounted = ref(false)

const handleScroll = () => {
  isScrolled.value = window.scrollY > 0
}

onMounted(() => {
  isMounted.value = true
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

const fallbackCategoryNav: CmsMenuItem[] = MAIN_CATEGORIES.map((c, i) => ({
  id: -(i + 1) * 100,
  label: c.name,
  link_type: 'category',
  url: `/categories/${c.slug}`,
  target: '_self',
  icon: null,
  sort_order: i,
  children: c.children.map((child, j) => ({
    id: -(i + 1) * 100 - (j + 1),
    label: child.name,
    link_type: 'category',
    url: `/categories/${c.slug}/${child.slug}`,
    target: '_self',
    icon: null,
    sort_order: j,
    children: [],
  })),
}))

const headerItems = computed<CmsMenuItem[]>(() => {
  const items = cmsStore.headerMenu?.items
  return items && items.length ? items : fallbackCategoryNav
})

const isExternal = (url?: string) => !!url && /^https?:\/\//i.test(url)
</script>

<template>
  <header class="bg-white dark:bg-pif-black">
    <!-- Top Bar -->
    <div class="bg-gray-100 dark:bg-dark-100 text-sm py-2 border-b border-gray-200 dark:border-dark-600">
      <div class="container">
        <div class="flex items-center justify-between">
          <p class="text-gray-600 dark:text-gray-400 text-xs md:text-sm">
            Nationwide Delivery | Free Delivery On Orders Over £100
          </p>

          <div class="hidden md:flex items-center gap-4">
            <button
              class="theme-toggle"
              :title="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
              @click="toggleTheme"
            >
              <Icon v-if="isDark" name="heroicons:sun" class="w-5 h-5" />
              <Icon v-else name="heroicons:moon" class="w-5 h-5" />
            </button>

            <button
              class="p-1 text-gray-600 dark:text-gray-400 hover:text-pif-green-dark dark:hover:text-pif-gold transition-colors"
              @click="uiStore.toggleSearch"
            >
              <Icon name="heroicons:magnifying-glass" class="w-5 h-5" />
            </button>

            <NuxtLink
              to="/account"
              class="p-1 text-gray-600 dark:text-gray-400 hover:text-pif-green-dark dark:hover:text-pif-gold transition-colors"
            >
              <Icon name="heroicons:user" class="w-5 h-5" />
            </NuxtLink>

            <button
              class="relative p-1 text-gray-600 dark:text-gray-400 hover:text-pif-green-dark dark:hover:text-pif-gold transition-colors"
              @click="uiStore.toggleCart"
            >
              <Icon name="heroicons:shopping-bag" class="w-5 h-5" />
              <span
                v-if="isMounted && cartStore.itemCount > 0"
                class="absolute -top-1 -right-1 w-4 h-4 flex items-center justify-center bg-pif-gold text-pif-black text-xs font-bold rounded-full"
              >
                {{ cartStore.itemCount }}
              </span>
            </button>
          </div>

          <nav class="hidden md:flex items-center gap-6">
            <NuxtLink
              v-for="link in NAV_LINKS"
              :key="link.path"
              :to="link.path"
              class="text-gray-600 dark:text-gray-400 hover:text-pif-green-dark dark:hover:text-pif-gold transition-colors text-sm"
            >
              {{ link.name }}
            </NuxtLink>
          </nav>

          <div class="flex md:hidden items-center gap-2">
            <button
              class="p-1 text-gray-600 dark:text-gray-400"
              @click="toggleTheme"
            >
              <Icon v-if="isDark" name="heroicons:sun" class="w-5 h-5" />
              <Icon v-else name="heroicons:moon" class="w-5 h-5" />
            </button>
            <button
              class="p-1 text-gray-600 dark:text-gray-400"
              @click="uiStore.toggleCart"
            >
              <Icon name="heroicons:shopping-bag" class="w-5 h-5" />
            </button>
            <button
              class="p-1 text-gray-600 dark:text-gray-400"
              @click="uiStore.toggleMobileMenu"
            >
              <Icon name="heroicons:bars-3" class="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Header: Logo -->
    <div class="py-6">
      <NuxtLink to="/" class="flex items-center justify-center gap-4 md:gap-8">
        <img
          src="/images/logo.png"
          alt="Premium Abrahimic Foods"
          class="h-16 md:h-24 w-auto flex-shrink-0"
        />
        <div class="text-center">
          <h1 class="font-heading text-2xl md:text-3xl text-pif-green-dark dark:text-pif-gold tracking-wide">
            Premium Abrahimic Foods
          </h1>
          <div class="w-full h-[2px] bg-pif-gold my-2" />
          <p class="text-xs md:text-sm text-pif-green dark:text-gray-400 tracking-[0.3em] uppercase">
            The Premium Halal Food
          </p>
        </div>
      </NuxtLink>
    </div>

    <!-- Category Navigation (CMS-driven) -->
    <nav
      :class="[
        'sticky top-0 z-40 bg-pif-green-dark transition-shadow duration-300',
        isScrolled && 'shadow-md dark:shadow-black/50',
      ]"
    >
      <div class="container">
        <ul class="hidden md:flex items-center justify-center gap-8 lg:gap-12">
          <li
            v-for="item in headerItems"
            :key="item.id"
            class="relative group"
          >
            <a
              v-if="isExternal(item.url)"
              :href="item.url"
              :target="item.target && item.target !== '_self' ? item.target : undefined"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-1 py-3 text-white text-sm font-medium hover:text-pif-gold transition-colors"
            >
              <Icon v-if="item.icon" :name="item.icon" class="w-4 h-4" />
              {{ item.label }}
              <Icon
                v-if="item.children?.length"
                name="heroicons:chevron-down"
                class="w-3 h-3 transition-transform group-hover:rotate-180"
              />
            </a>
            <NuxtLink
              v-else
              :to="item.url"
              class="inline-flex items-center gap-1 py-3 text-white text-sm font-medium hover:text-pif-gold transition-colors"
            >
              <Icon v-if="item.icon" :name="item.icon" class="w-4 h-4" />
              {{ item.label }}
              <Icon
                v-if="item.children?.length"
                name="heroicons:chevron-down"
                class="w-3 h-3 transition-transform group-hover:rotate-180"
              />
            </NuxtLink>
            <div
              v-if="item.children?.length"
              class="absolute left-0 top-full pt-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50"
            >
              <ul class="bg-white dark:bg-dark-200 rounded-lg shadow-lg dark:shadow-black/50 py-2 min-w-[180px] border border-transparent dark:border-dark-600">
                <li v-for="child in item.children" :key="child.id">
                  <a
                    v-if="isExternal(child.url)"
                    :href="child.url"
                    :target="child.target && child.target !== '_self' ? child.target : undefined"
                    rel="noopener noreferrer"
                    class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-pif-cream dark:hover:bg-dark-400 hover:text-pif-green-dark dark:hover:text-pif-gold transition-colors"
                  >
                    {{ child.label }}
                  </a>
                  <NuxtLink
                    v-else
                    :to="child.url"
                    class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-pif-cream dark:hover:bg-dark-400 hover:text-pif-green-dark dark:hover:text-pif-gold transition-colors"
                  >
                    {{ child.label }}
                  </NuxtLink>
                </li>
                <li v-if="!isExternal(item.url)" class="border-t border-gray-100 dark:border-dark-600 mt-2 pt-2">
                  <NuxtLink
                    :to="item.url"
                    class="block px-4 py-2 text-sm font-medium text-pif-green-dark dark:text-pif-gold hover:bg-pif-cream dark:hover:bg-dark-400 transition-colors"
                  >
                    View All {{ item.label }}
                  </NuxtLink>
                </li>
              </ul>
            </div>
          </li>
        </ul>
        <div class="md:hidden py-3 text-center">
          <button
            class="inline-flex items-center gap-2 text-white text-sm"
            @click="uiStore.toggleMobileMenu"
          >
            <Icon name="heroicons:bars-3" class="w-5 h-5" />
            Browse Categories
          </button>
        </div>
      </div>
    </nav>
  </header>
</template>
