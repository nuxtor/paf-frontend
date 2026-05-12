<script setup lang="ts">
import { NAV_LINKS, MAIN_CATEGORIES } from '~/utils/constants'
import type { CmsMenuItem } from '~/types/cms'

const uiStore = useUiStore()
const cmsStore = useCmsStore()
const { getAssetUrl } = useAsset()

watch(
  () => uiStore.isMobileMenuOpen,
  (isOpen) => {
    if (typeof document === 'undefined') return
    document.body.style.overflow = isOpen ? 'hidden' : ''
  }
)

const handleNavClick = () => {
  uiStore.closeMobileMenu()
}

const expanded = ref<Record<number, boolean>>({})
const toggleExpand = (id: number) => {
  expanded.value[id] = !expanded.value[id]
}

const fallbackCategoryItems: CmsMenuItem[] = MAIN_CATEGORIES.map((c, i) => ({
  id: -(i + 1) * 100,
  label: c.name,
  link_type: 'category',
  url: `/categories/${c.slug}`,
  target: '_self',
  icon: 'heroicons:tag',
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

const fallbackPageItems: CmsMenuItem[] = NAV_LINKS.map((l, i) => ({
  id: -1000 - i,
  label: l.name,
  link_type: 'url',
  url: l.path,
  target: '_self',
  icon: null,
  sort_order: i,
  children: [],
}))

const sections = computed<{ heading: string; items: CmsMenuItem[] }[]>(() => {
  const mobile = cmsStore.mobileMenu
  if (mobile?.items?.length) {
    const hasChildren = mobile.items.some((i) => i.children?.length)
    if (hasChildren) {
      return mobile.items.map((i) => ({
        heading: i.label,
        items: i.children?.length ? i.children : [i],
      }))
    }
    return [{ heading: 'Menu', items: mobile.items }]
  }
  const header = cmsStore.headerMenu
  const categoryItems = header?.items?.length ? header.items : fallbackCategoryItems
  return [
    { heading: 'Categories', items: categoryItems },
    { heading: 'Pages', items: fallbackPageItems },
  ]
})

const isExternal = (url?: string) => !!url && /^https?:\/\//i.test(url)
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
            <div v-for="section in sections" :key="section.heading" class="mb-6">
              <h3 class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                {{ section.heading }}
              </h3>
              <ul class="space-y-1">
                <li v-for="item in section.items" :key="item.id">
                  <div class="flex items-center">
                    <component
                      :is="isExternal(item.url) ? 'a' : resolveComponent('NuxtLink')"
                      :to="!isExternal(item.url) ? item.url : undefined"
                      :href="isExternal(item.url) ? item.url : undefined"
                      :target="item.target && item.target !== '_self' ? item.target : undefined"
                      :rel="isExternal(item.url) ? 'noopener noreferrer' : undefined"
                      class="flex-1 flex items-center gap-3 px-3 py-2 rounded-lg text-pif-black dark:text-white hover:bg-gray-100 dark:hover:bg-dark-300 transition-colors"
                      @click="handleNavClick"
                    >
                      <Icon
                        v-if="item.icon"
                        :name="item.icon"
                        class="w-5 h-5 text-pif-green dark:text-pif-gold"
                      />
                      <span>{{ item.label }}</span>
                    </component>
                    <button
                      v-if="item.children?.length"
                      class="p-2 text-gray-500 dark:text-gray-400"
                      :aria-label="`Toggle ${item.label} submenu`"
                      @click="toggleExpand(item.id)"
                    >
                      <Icon
                        name="heroicons:chevron-down"
                        :class="['w-4 h-4 transition-transform', expanded[item.id] && 'rotate-180']"
                      />
                    </button>
                  </div>
                  <ul
                    v-if="item.children?.length && expanded[item.id]"
                    class="ml-6 mt-1 space-y-1 border-l border-gray-200 dark:border-dark-600 pl-3"
                  >
                    <li v-for="child in item.children" :key="child.id">
                      <component
                        :is="isExternal(child.url) ? 'a' : resolveComponent('NuxtLink')"
                        :to="!isExternal(child.url) ? child.url : undefined"
                        :href="isExternal(child.url) ? child.url : undefined"
                        :target="child.target && child.target !== '_self' ? child.target : undefined"
                        :rel="isExternal(child.url) ? 'noopener noreferrer' : undefined"
                        class="block px-3 py-2 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-300 transition-colors"
                        @click="handleNavClick"
                      >
                        {{ child.label }}
                      </component>
                    </li>
                  </ul>
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
