import type { Product, Category, ProductImage, ProductVariant } from '~/types/product'

interface ApiCategory {
  id: number
  name: string
  slug: string
  description?: string | null
  image?: string | null
  parent_id?: number | null
  children?: ApiCategory[]
  product_count?: number
}

interface ApiProductImage {
  id?: number
  url?: string
  path?: string
  alt?: string | null
  alt_text?: string | null
  position?: number
  is_primary?: boolean
}

interface ApiProductVariant {
  id: number
  name: string
  sku: string
  price: string | number
  compare_at_price?: string | number | null
  stock_quantity?: number
  attributes?: Record<string, string> | null
  is_active?: boolean
}

interface ApiProduct {
  id: number
  name: string
  slug: string
  sku: string
  short_description: string
  description: string
  price: string | number
  compare_at_price?: string | number | null
  unit?: string
  stock_status: 'in_stock' | 'low_stock' | 'out_of_stock'
  is_featured?: boolean
  halal_certification?: string | null
  ingredients?: string | null
  allergens?: string | null
  storage_instructions?: string | null
  country_of_origin?: string | null
  category?: ApiCategory | null
  primary_image?: ApiProductImage | null
  images?: ApiProductImage[]
  variants?: ApiProductVariant[]
  has_variants?: boolean
  discount_percentage?: number | null
}

const toNum = (v: string | number | null | undefined): number => {
  if (v === null || v === undefined) return 0
  return typeof v === 'string' ? parseFloat(v) : v
}

export const adaptCategory = (c: ApiCategory): Category => ({
  id: c.id,
  name: c.name,
  slug: c.slug,
  description: c.description ?? undefined,
  image: c.image ?? undefined,
  parent_id: c.parent_id ?? undefined,
  children: c.children?.map(adaptCategory),
  product_count: c.product_count,
})

const buildImageUrl = (pathOrUrl: string): string => {
  if (!pathOrUrl) return ''
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl
  const config = useRuntimeConfig()
  const base = (config.public.imageBaseUrl as string) || ''
  const cleanBase = base.replace(/\/$/, '')
  const cleanPath = pathOrUrl.replace(/^\//, '')
  return `${cleanBase}/${cleanPath}`
}

const adaptImage = (img: ApiProductImage, index = 0): ProductImage => ({
  id: img.id ?? index,
  url: buildImageUrl(img.url || img.path || ''),
  alt: img.alt ?? img.alt_text ?? undefined,
  position: img.position ?? index,
})

const adaptVariant = (v: ApiProductVariant, productId: number): ProductVariant => ({
  id: v.id,
  product_id: productId,
  name: v.name,
  sku: v.sku,
  price: toNum(v.price),
  compare_at_price: v.compare_at_price != null ? toNum(v.compare_at_price) : undefined,
  stock_quantity: v.stock_quantity ?? 0,
  options: v.attributes
    ? Object.entries(v.attributes).map(([name, value]) => ({ name, value: String(value) }))
    : [],
})

export const adaptProduct = (p: ApiProduct): Product => {
  const compare = p.compare_at_price != null ? toNum(p.compare_at_price) : undefined
  const images = p.images?.length
    ? p.images.map(adaptImage)
    : p.primary_image
      ? [adaptImage(p.primary_image)]
      : []

  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    sku: p.sku,
    short_description: p.short_description,
    description: p.description,
    price: toNum(p.price),
    compare_at_price: compare,
    featured_image: p.primary_image
      ? buildImageUrl(p.primary_image.url || p.primary_image.path || '')
      : images[0]?.url ?? '',
    images,
    category: p.category ? adaptCategory(p.category) : undefined,
    category_id: p.category?.id ?? 0,
    stock_quantity: 0,
    stock_status: p.stock_status,
    is_active: true,
    is_featured: !!p.is_featured,
    is_new: false,
    halal_certified: !!p.halal_certification,
    ingredients: p.ingredients ?? undefined,
    allergens: p.allergens ? [p.allergens] : undefined,
    has_variants: !!p.has_variants,
    variants: p.variants?.map(v => adaptVariant(v, p.id)),
    created_at: '',
    updated_at: '',
  }
}

export const adaptProducts = (list: ApiProduct[]): Product[] => list.map(adaptProduct)
