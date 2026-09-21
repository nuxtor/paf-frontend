<script setup lang="ts">
import type { NuxtError } from '#app'
import type { Product } from '~/types/product'
import { adaptProducts } from '~/utils/product-adapter'
import { FREE_DELIVERY_THRESHOLD } from '~/utils/constants'

const props = defineProps<{ error: NuxtError }>()

const is404 = computed(() => props.error?.statusCode === 404)

const pageTitle = computed(() =>
  is404.value
    ? 'Page not found | Premium Abrahamic Foods'
    : 'Something went wrong | Premium Abrahamic Foods'
)

useHead({
  title: pageTitle,
  meta: [{ name: 'robots', content: 'noindex' }],
})

// When the very first route fails (a mistyped URL landing on 200.html), Nuxt's
// head plugin is left paused and never writes the title above, so the tab
// keeps the homepage's. Set it directly once mounted.
onMounted(() => {
  document.title = pageTitle.value
})

// error.vue renders in place of app.vue, so the header and footer would
// otherwise come up without the logo and menus app.vue normally fetches.
// The store's loaded flags make these free when app.vue already ran.
const cmsStore = useCmsStore()
await Promise.all([
  cmsStore.fetchSite(),
  cmsStore.fetchMenu('header'),
  cmsStore.fetchMenu('footer'),
  cmsStore.fetchMenu('mobile'),
])

const productsStore = useProductsStore()

const popular = ref<Product[]>([])
const offers = ref<Product[]>([])
const isLoadingProducts = ref(true)
const searchTerm = ref('')

const isOnSale = (p: Product) => !!p.compare_at_price && p.compare_at_price > p.price

// Fetched on the client only: 404.html is prerendered once and served for
// every unknown URL, so anything baked in at build time would go stale.
onMounted(async () => {
  const { apiFetch } = useApi()
  const [bestsellers, specials] = await Promise.all([
    apiFetch<{ data: any[] }>('/shop/products', {
      query: { sort: 'bestselling', per_page: 8 },
    }).catch(() => ({ data: [] })),
    apiFetch<{ data: any[] }>('/shop/products', {
      query: { category: 'special-offers', per_page: 4 },
    }).catch(() => ({ data: [] })),
    productsStore.categories.length ? null : productsStore.fetchCategories(),
  ])

  const best = adaptProducts(bestsellers.data)
  const special = adaptProducts(specials.data)

  // Offers: the Special Offers category first, topped up with anything
  // discounted among the best sellers.
  const saleIds = new Set(special.map((p) => p.id))
  offers.value = [...special, ...best.filter((p) => isOnSale(p) && !saleIds.has(p.id))].slice(0, 4)

  const offerIds = new Set(offers.value.map((p) => p.id))
  popular.value = best.filter((p) => !offerIds.has(p.id)).slice(0, 4)
  isLoadingProducts.value = false
})

const categories = computed(() => productsStore.categories.slice(0, 8))

const submitSearch = () => {
  const q = searchTerm.value.trim()
  navigateTo(q ? { path: '/products', query: { search: q } } : '/products')
}

const retry = () => clearError({ redirect: useRoute().fullPath })

const perks = [
  {
    icon: 'heroicons:truck',
    title: `Free delivery over ${formatCurrency(FREE_DELIVERY_THRESHOLD)}`,
    text: 'On orders shipped within mainland UK.',
    to: '/products',
  },
  {
    icon: 'heroicons:check-badge',
    title: '100% halal certified',
    text: 'Hand-picked, fresh cuts from trusted suppliers.',
    to: '/about-us',
  },
  {
    icon: 'heroicons:building-storefront',
    title: 'Wholesale pricing',
    text: 'Trade accounts get tiered discounts on every order.',
    to: '/wholesale',
  },
]
</script>

<template>
  <NuxtLayout>
    <!-- Hero -->
    <section class="relative overflow-hidden bg-pif-cream dark:bg-dark-100 border-b border-gray-200 dark:border-dark-600">
      <div
        class="pointer-events-none absolute -top-24 -right-24 w-96 h-96 rounded-full bg-pif-green-dark/10 dark:bg-pif-gold/10 blur-3xl"
        aria-hidden="true"
      />
      <div
        class="pointer-events-none absolute -bottom-32 -left-24 w-96 h-96 rounded-full bg-pif-green/10 dark:bg-pif-green-dark/10 blur-3xl"
        aria-hidden="true"
      />

      <div class="container relative py-16 md:py-24 text-center">
        <p
          class="font-heading text-[7rem] md:text-[10rem] leading-none text-transparent bg-clip-text bg-gradient-to-b from-pif-green-dark to-pif-green dark:from-pif-gold-light dark:to-pif-gold select-none"
          aria-hidden="true"
        >
          {{ is404 ? '404' : error?.statusCode || 'Oops' }}
        </p>

        <h1 class="font-heading text-3xl md:text-5xl text-pif-black dark:text-white mt-2">
          {{ is404 ? 'This page is off the menu' : 'Something went wrong' }}
        </h1>
        <p class="mt-4 max-w-xl mx-auto text-gray-700 dark:text-gray-300">
          <template v-if="is404">
            The page you were looking for has moved, sold out or never existed.
            Try a search, or pick something from our most popular cuts below.
          </template>
          <template v-else>
            We couldn't load this page just now. Please try again in a moment.
          </template>
        </p>

        <!-- Search -->
        <form
          v-if="is404"
          class="mt-8 max-w-lg mx-auto flex gap-2"
          role="search"
          @submit.prevent="submitSearch"
        >
          <label for="notfound-search" class="sr-only">Search products</label>
          <div class="relative flex-1">
            <Icon
              name="heroicons:magnifying-glass"
              class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500"
            />
            <input
              id="notfound-search"
              v-model="searchTerm"
              type="search"
              placeholder="Search lamb, chicken, mutton…"
              class="w-full pl-10 pr-4 py-3 rounded-lg bg-white dark:bg-dark-200 border border-gray-300 dark:border-dark-600 text-pif-black dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pif-green dark:focus:ring-pif-gold"
            />
          </div>
          <button
            type="submit"
            class="btn px-5 py-3 bg-pif-green-dark dark:bg-pif-gold text-white dark:text-pif-black hover:bg-pif-green dark:hover:bg-pif-gold-light"
          >
            Search
          </button>
        </form>

        <!-- Actions -->
        <div class="mt-6 flex flex-wrap items-center justify-center gap-3">
          <button
            v-if="!is404"
            type="button"
            class="btn px-5 py-2.5 bg-pif-green-dark dark:bg-pif-gold text-white dark:text-pif-black hover:bg-pif-green dark:hover:bg-pif-gold-light"
            @click="retry"
          >
            <Icon name="heroicons:arrow-path" class="w-4 h-4 mr-2" />
            Try again
          </button>
          <NuxtLink
            to="/products"
            class="btn px-5 py-2.5 border border-pif-green-dark dark:border-pif-gold text-pif-green-dark dark:text-pif-gold hover:bg-pif-green-dark/5 dark:hover:bg-pif-gold/10"
          >
            <Icon name="heroicons:shopping-bag" class="w-4 h-4 mr-2" />
            Shop all products
          </NuxtLink>
          <NuxtLink
            to="/"
            class="btn px-5 py-2.5 text-gray-700 dark:text-gray-300 hover:text-pif-green-dark dark:hover:text-pif-gold"
          >
            <Icon name="heroicons:home" class="w-4 h-4 mr-2" />
            Back to home
          </NuxtLink>
        </div>

        <!-- Categories -->
        <div v-if="categories.length" class="mt-10 flex flex-wrap justify-center gap-2">
          <NuxtLink
            v-for="category in categories"
            :key="category.id"
            :to="`/categories/${category.slug}`"
            class="px-4 py-1.5 rounded-full text-sm bg-white dark:bg-dark-200 border border-gray-200 dark:border-dark-600 text-gray-700 dark:text-gray-300 hover:border-pif-green-dark hover:text-pif-green-dark dark:hover:border-pif-gold dark:hover:text-pif-gold transition-colors"
          >
            {{ category.name }}
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Offers -->
    <section class="section-padding bg-white dark:bg-pif-black">
      <div class="container">
        <div class="flex items-end justify-between gap-4 mb-8">
          <div>
            <p class="text-sm font-medium uppercase tracking-wider text-pif-green dark:text-pif-gold">
              Don't miss out
            </p>
            <h2 class="font-heading text-3xl md:text-4xl text-pif-black dark:text-white mt-1">
              {{ offers.length ? 'Current offers' : 'Why shop with us' }}
            </h2>
          </div>
          <NuxtLink
            v-if="offers.length"
            to="/categories/special-offers"
            class="shrink-0 text-sm font-medium text-pif-green-dark dark:text-pif-gold hover:underline"
          >
            All offers →
          </NuxtLink>
        </div>

        <div v-if="offers.length" class="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <ProductCard v-for="product in offers" :key="product.id" :product="product" />
        </div>

        <!-- No live offers: show the standing perks instead of an empty row -->
        <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <NuxtLink
            v-for="perk in perks"
            :key="perk.title"
            :to="perk.to"
            class="group flex items-start gap-4 p-6 rounded-xl bg-pif-cream dark:bg-dark-200 border border-gray-200 dark:border-dark-600 hover:border-pif-green-dark dark:hover:border-pif-gold transition-colors"
          >
            <span class="shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-pif-green-dark/10 dark:bg-pif-gold/15 text-pif-green-dark dark:text-pif-gold">
              <Icon :name="perk.icon" class="w-6 h-6" />
            </span>
            <span>
              <span class="block font-heading text-lg text-pif-black dark:text-white group-hover:text-pif-green-dark dark:group-hover:text-pif-gold transition-colors">
                {{ perk.title }}
              </span>
              <span class="block mt-1 text-sm text-gray-500 dark:text-gray-400">{{ perk.text }}</span>
            </span>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Popular products -->
    <section class="section-padding bg-pif-cream dark:bg-dark-100">
      <div class="container">
        <div class="flex items-end justify-between gap-4 mb-8">
          <div>
            <p class="text-sm font-medium uppercase tracking-wider text-pif-green dark:text-pif-gold">
              Customer favourites
            </p>
            <h2 class="font-heading text-3xl md:text-4xl text-pif-black dark:text-white mt-1">
              Popular products
            </h2>
          </div>
          <NuxtLink
            to="/products"
            class="shrink-0 text-sm font-medium text-pif-green-dark dark:text-pif-gold hover:underline"
          >
            View all →
          </NuxtLink>
        </div>

        <div v-if="isLoadingProducts" class="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <div
            v-for="i in 4"
            :key="i"
            class="aspect-[3/4] bg-gray-100 dark:bg-dark-200 rounded-xl animate-pulse"
          />
        </div>
        <div v-else-if="popular.length" class="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <ProductCard v-for="product in popular" :key="product.id" :product="product" />
        </div>
        <p v-else class="text-center py-8 text-gray-500 dark:text-gray-400">
          Browse our full range in the
          <NuxtLink to="/products" class="text-pif-green-dark dark:text-pif-gold underline">shop</NuxtLink>.
        </p>
      </div>
    </section>
  </NuxtLayout>
</template>
