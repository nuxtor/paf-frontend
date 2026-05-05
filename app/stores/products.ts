import { defineStore } from 'pinia'
import type { Product, Category, ProductFilters } from '~/types/product'

export const useProductsStore = defineStore('products', () => {
  // State
  const products = ref<Product[]>([])
  const featuredProducts = ref<Product[]>([])
  const latestProducts = ref<Product[]>([])
  const categories = ref<Category[]>([])
  const currentProduct = ref<Product | null>(null)
  const isLoading = ref(false)
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
    categories.value.find((c) => c.slug === slug)
  )

  // Actions
  const fetchProducts = async (filters?: ProductFilters) => {
    isLoading.value = true
    try {
      // TODO: Implement API call
      // const response = await apiFetch<PaginatedResponse<Product>>('/products', {
      //   query: filters,
      // })
      // products.value = response.data
      // pagination.value = response.meta
    } finally {
      isLoading.value = false
    }
  }

  const fetchFeaturedProducts = async () => {
    isLoading.value = true
    try {
      // TODO: Implement API call
      // For now, use dummy data
    } finally {
      isLoading.value = false
    }
  }

  const fetchLatestProducts = async () => {
    isLoading.value = true
    try {
      // TODO: Implement API call
    } finally {
      isLoading.value = false
    }
  }

  const fetchProduct = async (slug: string) => {
    isLoading.value = true
    try {
      // TODO: Implement API call
      // currentProduct.value = await apiFetch<Product>(`/products/${slug}`)
    } finally {
      isLoading.value = false
    }
  }

  const fetchCategories = async () => {
    isLoading.value = true
    try {
      // TODO: Implement API call
      // For now, use static categories
      categories.value = [
        {
          id: 1,
          name: 'Meat',
          slug: 'meat',
          description: 'Premium halal meat cuts',
          image: 'images/products/meat-products-01.jpg',
        },
        {
          id: 2,
          name: 'Poultry',
          slug: 'poultry',
          description: 'Fresh halal poultry',
          image: 'images/products/meat-products-02.jpg',
        },
        {
          id: 3,
          name: 'Seafood',
          slug: 'seafood',
          description: 'Fresh seafood selection',
          image: 'images/products/meat-products-03.jpg',
        },
        {
          id: 4,
          name: 'Groceries',
          slug: 'groceries',
          description: 'Halal groceries and essentials',
          image: 'images/products/meat-products-04.jpg',
        },
        {
          id: 5,
          name: 'Spices',
          slug: 'spices',
          description: 'Premium spices and seasonings',
          image: 'images/products/meat-products-05.jpg',
        },
        {
          id: 6,
          name: 'Frozen',
          slug: 'frozen',
          description: 'Frozen halal products',
          image: 'images/products/meat-products-06.jpg',
        },
      ]
    } finally {
      isLoading.value = false
    }
  }

  const searchProducts = async (query: string) => {
    return await fetchProducts({ search: query })
  }

  return {
    // State
    products,
    featuredProducts,
    latestProducts,
    categories,
    currentProduct,
    isLoading,
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
