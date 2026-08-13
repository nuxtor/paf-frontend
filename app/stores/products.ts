import { defineStore } from 'pinia'
import type { Product, Category, ProductFilters } from '~/types/product'
import { adaptProduct, adaptProducts, adaptCategory } from '~/utils/product-adapter'

interface PaginatedProductsResponse {
  data: any[]
  meta?: {
    current_page: number
    last_page: number
    per_page: number
    total: number
  }
}

interface SingleProductResponse {
  product?: any
  data?: any
  pricing?: unknown
}

interface CategoriesResponse {
  categories: any[]
}

const flattenCategories = (categories: Category[]): Category[] => {
  const flat: Category[] = []
  for (const c of categories) {
    flat.push(c)
    if (c.children?.length) {
      flat.push(...flattenCategories(c.children))
    }
  }
  return flat
}

export const useProductsStore = defineStore('products', () => {
  // State
  const products = ref<Product[]>([])
  const featuredProducts = ref<Product[]>([])
  const latestProducts = ref<Product[]>([])
  const categories = ref<Category[]>([])
  const flatCategories = ref<Category[]>([])
  const currentProduct = ref<Product | null>(null)
  const isLoading = ref(false)
  const isLoadingMore = ref(false)
  const pagination = ref({
    currentPage: 1,
    lastPage: 1,
    perPage: 12,
    total: 0,
  })

  // Getters
  const productsByCategory = computed(() => (categorySlug: string) =>
    products.value.filter((p) => p.category?.slug === categorySlug)
  )

  const getCategoryBySlug = computed(() => (slug: string) =>
    flatCategories.value.find((c) => c.slug === slug)
  )

  // Actions
  const fetchProducts = async (filters?: ProductFilters, append = false) => {
    const { apiFetch } = useApi()
    if (append) {
      isLoadingMore.value = true
    } else {
      isLoading.value = true
    }
    try {
      const response = await apiFetch<PaginatedProductsResponse>('/shop/products', {
        query: filters as Record<string, any>,
      })
      const adapted = adaptProducts(response.data)
      products.value = append ? [...products.value, ...adapted] : adapted
      if (response.meta) {
        pagination.value = {
          currentPage: response.meta.current_page,
          lastPage: response.meta.last_page,
          perPage: response.meta.per_page,
          total: response.meta.total,
        }
      }
    } catch (error) {
      console.error('Failed to fetch products', error)
      if (!append) products.value = []
    } finally {
      isLoading.value = false
      isLoadingMore.value = false
    }
  }

  const fetchFeaturedProducts = async () => {
    const { apiFetch } = useApi()
    isLoading.value = true
    try {
      const response = await apiFetch<{ data: any[] }>('/shop/products/featured')
      featuredProducts.value = adaptProducts(response.data)
    } catch (error) {
      console.error('Failed to fetch featured products', error)
      featuredProducts.value = []
    } finally {
      isLoading.value = false
    }
  }

  const fetchLatestProducts = async () => {
    const { apiFetch } = useApi()
    isLoading.value = true
    try {
      const response = await apiFetch<PaginatedProductsResponse>('/shop/products', {
        query: { sort: 'newest', per_page: 8 },
      })
      latestProducts.value = adaptProducts(response.data)
    } catch (error) {
      console.error('Failed to fetch latest products', error)
      latestProducts.value = []
    } finally {
      isLoading.value = false
    }
  }

  const fetchProduct = async (slug: string) => {
    const { apiFetch } = useApi()
    isLoading.value = true
    try {
      const response = await apiFetch<SingleProductResponse>(`/shop/products/${slug}`)
      const raw = response.product ?? response.data
      currentProduct.value = raw ? adaptProduct(raw) : null
      return currentProduct.value
    } catch (error) {
      console.error(`Failed to fetch product ${slug}`, error)
      currentProduct.value = null
      return null
    } finally {
      isLoading.value = false
    }
  }

  const fetchCategories = async () => {
    const { apiFetch } = useApi()
    isLoading.value = true
    try {
      const response = await apiFetch<CategoriesResponse>('/shop/categories')
      categories.value = response.categories.map(adaptCategory)
      flatCategories.value = flattenCategories(categories.value)
    } catch (error) {
      console.error('Failed to fetch categories', error)
      categories.value = []
      flatCategories.value = []
    } finally {
      isLoading.value = false
    }
  }

  const searchProducts = async (query: string) => {
    const { apiFetch } = useApi()
    isLoading.value = true
    try {
      const response = await apiFetch<{ data: any[] }>('/shop/search', {
        query: { q: query },
      })
      products.value = adaptProducts(response.data)
    } catch (error) {
      console.error('Search failed', error)
      products.value = []
    } finally {
      isLoading.value = false
    }
  }

  return {
    // State
    products,
    featuredProducts,
    latestProducts,
    categories,
    flatCategories,
    currentProduct,
    isLoading,
    isLoadingMore,
    pagination,
    // Getters
    productsByCategory,
    getCategoryBySlug,
    // Actions
    fetchProducts,
    fetchFeaturedProducts,
    fetchLatestProducts,
    fetchProduct,
    fetchCategories,
    searchProducts,
  }
})
