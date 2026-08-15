<script setup lang="ts">
import { NAV_LINKS, MAIN_CATEGORIES, CONTACT_PHONES } from '~/utils/constants'
import type { CmsMenuItem } from '~/types/cms'

const cartStore = useCartStore()
const uiStore = useUiStore()
const cmsStore = useCmsStore()
const { src: logoSrc, alt: logoAlt } = useSiteLogo()

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

// Home is the logo, which sits between these links, so it would only be a
// second route to the same place.
const utilityLinks = NAV_LINKS.filter((l) => l.path !== '/')

const phone = CONTACT_PHONES[0]!
const telHref = `tel:${phone.number.replace(/\s+/g, '')}`

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
  <header class="bg-pif-black">
    <!-- Utility bar -->
    <div class="bg-dark-100 border-b border-pif-gold/20 text-xs sm:text-[13px] tracking-wide text-gray-400">
      <div class="container">
        <div class="flex items-center justify-between gap-6 py-2.5">
          <p class="flex items-center gap-2.5 min-w-0">
            <span class="w-1.5 h-1.5 rounded-full bg-pif-green-dark shrink-0" />
            <span class="truncate">
              Nationwide delivery · Min. order £40 · £5.99 in 24–48h · Free over £100
            </span>
          </p>

          <nav class="hidden lg:flex items-center gap-6 shrink-0">
            <NuxtLink
              v-for="link in utilityLinks"
              :key="link.path"
              :to="link.path"
              class="hover:text-pif-gold transition-colors"
            >
              {{ link.name }}
            </NuxtLink>
            <a :href="telHref" class="font-semibold text-pif-gold hover:text-pif-gold-light transition-colors">
              {{ phone.number }}
            </a>
          </nav>
        </div>
      </div>
    </div>

    <!-- Main Header: search, logo, account and basket -->
    <div class="container">
      <div
        class="grid grid-cols-[auto_1fr_auto] md:grid-cols-[1fr_auto_1fr] items-center gap-3 md:gap-8 py-4 md:py-5"
      >
        <div class="flex items-center">
          <button
            class="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-full border border-dark-600 text-gray-300 hover:text-white transition-colors"
            aria-label="Browse categories"
            @click="uiStore.toggleMobileMenu"
          >
            <Icon name="heroicons:bars-3" class="w-5 h-5" />
          </button>

          <!-- Reads as the search field the design draws, but opens the search
               modal that already does the work rather than being a second
               input that has to be kept in step with it. -->
          <button
            class="hidden md:flex items-center gap-3 w-full max-w-xs px-4 py-2.5 rounded-full bg-dark-200 border border-dark-600 text-left text-gray-500 hover:border-pif-gold/50 transition-colors"
            @click="uiStore.toggleSearch"
          >
            <Icon name="heroicons:magnifying-glass" class="w-4 h-4 shrink-0" />
            <span class="truncate text-sm">Search lamb, mutton, marination…</span>
          </button>
        </div>

        <NuxtLink to="/" class="flex items-center justify-center">
          <img :src="logoSrc" :alt="logoAlt" class="h-12 md:h-20 w-auto" />
        </NuxtLink>

        <div class="flex items-center justify-end gap-2 md:gap-3">
          <button
            class="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-full border border-dark-600 text-gray-300 hover:text-white transition-colors"
            aria-label="Search"
            @click="uiStore.toggleSearch"
          >
            <Icon name="heroicons:magnifying-glass" class="w-5 h-5" />
          </button>

          <NuxtLink
            to="/account"
            class="inline-flex items-center justify-center gap-2 w-10 h-10 md:w-auto md:h-auto md:px-4 md:py-2.5 rounded-full border border-dark-600 text-sm text-gray-200 hover:border-pif-gold/50 hover:text-white transition-colors"
          >
            <Icon name="heroicons:user" class="w-5 h-5 md:w-4 md:h-4" />
            <span class="hidden md:inline">Account</span>
          </NuxtLink>

          <button
            class="inline-flex items-center gap-2 px-4 md:px-5 py-2.5 rounded-full bg-pif-green-dark text-pif-black text-sm font-semibold whitespace-nowrap hover:brightness-110 transition-[filter]"
            @click="uiStore.toggleCart"
          >
            <Icon name="heroicons:shopping-bag" class="w-4 h-4" />
            <span class="hidden sm:inline">Basket ·</span>
            <!-- The cart is restored from storage on the client, so the count
                 stays at zero until then rather than mismatching the prerender. -->
            {{ isMounted ? cartStore.itemCount : 0 }}
          </button>
        </div>
      </div>
    </div>

    <!-- Category Navigation (CMS-driven) -->
    <nav
      :class="[
        'sticky top-0 z-40 bg-gradient-to-b from-pif-green-dark to-pif-green-deep transition-shadow duration-300',
        isScrolled && 'shadow-md shadow-black/50',
      ]"
    >
      <div class="container">
        <ul class="hidden md:flex flex-wrap items-stretch justify-center lg:justify-between">
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
              class="inline-flex items-center gap-1 px-3 lg:px-4 py-3.5 font-heading text-lg tracking-[0.07em] uppercase text-white border-b-[3px] border-transparent hover:bg-black/20 hover:border-pif-gold transition-colors"
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
              class="inline-flex items-center gap-1 px-3 lg:px-4 py-3.5 font-heading text-lg tracking-[0.07em] uppercase text-white border-b-[3px] border-transparent hover:bg-black/20 hover:border-pif-gold transition-colors"
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
              <ul class="bg-dark-200 rounded-lg shadow-lg shadow-black/50 py-2 min-w-[180px] border border-dark-600">
                <li v-for="child in item.children" :key="child.id">
                  <a
                    v-if="isExternal(child.url)"
                    :href="child.url"
                    :target="child.target && child.target !== '_self' ? child.target : undefined"
                    rel="noopener noreferrer"
                    class="block px-4 py-2 font-heading text-base tracking-wide text-gray-300 hover:bg-dark-400 hover:text-pif-gold transition-colors"
                  >
                    {{ child.label }}
                  </a>
                  <NuxtLink
                    v-else
                    :to="child.url"
                    class="block px-4 py-2 font-heading text-base tracking-wide text-gray-300 hover:bg-dark-400 hover:text-pif-gold transition-colors"
                  >
                    {{ child.label }}
                  </NuxtLink>
                </li>
                <li v-if="!isExternal(item.url)" class="border-t border-dark-600 mt-2 pt-2">
                  <NuxtLink
                    :to="item.url"
                    class="block px-4 py-2 font-heading text-base tracking-wide text-pif-gold hover:bg-dark-400 transition-colors"
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
            class="inline-flex items-center gap-2 text-white font-heading text-base tracking-wide"
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
