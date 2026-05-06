<script setup lang="ts">
import type { Product } from '~/types/product'
import { adaptProducts } from '~/utils/product-adapter'

const uiStore = useUiStore()
const { apiFetch } = useApi()
const { getAssetUrl } = useAsset()
const router = useRouter()

const query = ref('')
const results = ref<Product[]>([])
const isLoading = ref(false)
const hasSearched = ref(false)
const inputRef = ref<HTMLInputElement | null>(null)

let debounceTimer: ReturnType<typeof setTimeout> | null = null

const runSearch = async (q: string) => {
  if (q.trim().length < 2) {
    results.value = []
    hasSearched.value = false
    return
  }
  isLoading.value = true
  try {
    const response = await apiFetch<{ data: any[] }>('/shop/search', {
      query: { q: q.trim() },
    })
    results.value = adaptProducts(response.data)
    hasSearched.value = true
  } catch (error) {
    console.error('Search failed', error)
    results.value = []
    hasSearched.value = true
  } finally {
    isLoading.value = false
  }
}

watch(query, (q) => {
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => runSearch(q), 250)
})

watch(
  () => uiStore.isSearchOpen,
  async (open) => {
    if (open) {
      await nextTick()
      inputRef.value?.focus()
    } else {
      query.value = ''
      results.value = []
      hasSearched.value = false
    }
  }
)

const close = () => {
  uiStore.isSearchOpen = false
}

const selectProduct = (slug: string) => {
  close()
  router.push(`/products/${slug}`)
}

const submitSearch = () => {
  if (!query.value.trim()) return
  close()
  router.push({ path: '/products', query: { search: query.value.trim() } })
}

const onKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && uiStore.isSearchOpen) {
    close()
  }
}

onMounted(() => {
  document.addEventListener('keydown', onKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', onKeydown)
  if (debounceTimer) clearTimeout(debounceTimer)
})
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-200"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-150"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="uiStore.isSearchOpen"
        class="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
        @click.self="close"
      >
        <div class="container mx-auto pt-20 px-4">
          <div class="bg-white dark:bg-dark-200 rounded-xl shadow-2xl max-w-2xl mx-auto overflow-hidden">
            <!-- Search Input -->
            <form class="flex items-center gap-3 p-4 border-b border-gray-200 dark:border-dark-600" @submit.prevent="submitSearch">
              <Icon name="heroicons:magnifying-glass" class="w-5 h-5 text-gray-400 flex-shrink-0" />
              <input
                ref="inputRef"
                v-model="query"
                type="search"
                placeholder="Search for products..."
                class="flex-1 bg-transparent text-pif-black dark:text-white placeholder-gray-400 focus:outline-none text-base"
              />
              <button
                type="button"
                class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                aria-label="Close search"
                @click="close"
              >
                <Icon name="heroicons:x-mark" class="w-5 h-5" />
              </button>
            </form>

            <!-- Results -->
            <div class="max-h-[60vh] overflow-y-auto">
              <!-- Hint -->
              <div
                v-if="!query.trim()"
                class="p-8 text-center text-gray-500 dark:text-gray-400 text-sm"
              >
                Type at least 2 characters to search
              </div>

              <!-- Loading -->
              <div
                v-else-if="isLoading"
                class="p-8 text-center"
              >
                <PSpinner size="md" />
              </div>

              <!-- No Results -->
              <div
                v-else-if="hasSearched && results.length === 0"
                class="p-8 text-center text-gray-500 dark:text-gray-400"
              >
                <Icon name="heroicons:face-frown" class="w-10 h-10 mx-auto mb-2 text-gray-300" />
                <p class="text-sm">No products found for "{{ query }}"</p>
              </div>

              <!-- Results List -->
              <ul v-else-if="results.length > 0" class="divide-y divide-gray-100 dark:divide-dark-600">
                <li v-for="product in results" :key="product.id">
                  <button
                    type="button"
                    class="w-full flex items-center gap-3 p-3 hover:bg-pif-cream dark:hover:bg-dark-300 transition-colors text-left"
                    @click="selectProduct(product.slug)"
                  >
                    <div class="w-12 h-12 flex-shrink-0 bg-gray-100 dark:bg-dark-300 rounded-lg overflow-hidden flex items-center justify-center">
                      <img
                        v-if="product.featured_image"
                        :src="getAssetUrl(product.featured_image)"
                        :alt="product.name"
                        class="w-full h-full object-cover"
                      />
                      <Icon v-else name="heroicons:photo" class="w-6 h-6 text-gray-300" />
                    </div>
                    <div class="flex-1 min-w-0">
                      <p class="font-medium text-sm text-pif-black dark:text-white truncate">
                        {{ product.name }}
                      </p>
                      <p class="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {{ product.category?.name }}
                      </p>
                    </div>
                    <span class="font-semibold text-pif-green-dark dark:text-pif-gold text-sm flex-shrink-0">
                      {{ formatCurrency(product.price) }}
                    </span>
                  </button>
                </li>
              </ul>

              <!-- See all link -->
              <div
                v-if="results.length > 0"
                class="border-t border-gray-100 dark:border-dark-600 p-3"
              >
                <button
                  type="button"
                  class="w-full text-center text-sm font-medium text-pif-green-dark dark:text-pif-gold hover:underline"
                  @click="submitSearch"
                >
                  See all results for "{{ query }}"
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
