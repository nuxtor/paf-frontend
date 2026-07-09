import type {
  Product,
  Category,
  ProductImage,
  ProductVariant,
  ProductOption,
} from '~/types/product'

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

interface ApiProductOption {
  name: string
  values?: string[] | null
}

interface ApiProductVariant {
  id: number
  name: string
  sku: string
  price: string | number
  compare_at_price?: string | number | null
  stock_status?: 'in_stock' | 'low_stock' | 'out_of_stock'
  // Populated variants send an object ({ Size: 'Large' }); empty ones send [].
  attributes?: Record<string, string> | string[] | null
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
  unit_label?: string
  sold_by_weight?: boolean
  quantity_step?: string | number | null
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
  options?: ApiProductOption[]
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

// The API sends variant attributes as an object when populated ({ Size: 'Large' })
// but as an empty array ([]) when the variant has none — normalise both to a map.
const adaptAttributes = (
  attrs: Record<string, string> | string[] | null | undefined
): Record<string, string> => {
  if (!attrs || Array.isArray(attrs)) return {}
  return Object.fromEntries(Object.entries(attrs).map(([name, value]) => [name, String(value)]))
}

const adaptOption = (o: ApiProductOption): ProductOption => ({
  name: o.name,
  values: o.values ?? [],
})

const adaptVariant = (v: ApiProductVariant, productId: number): ProductVariant => {
  const attributes = adaptAttributes(v.attributes)
  return {
    id: v.id,
    product_id: productId,
    name: v.name,
    sku: v.sku,
    price: toNum(v.price),
    compare_at_price: v.compare_at_price != null ? toNum(v.compare_at_price) : undefined,
    stock_status: v.stock_status,
    is_active: v.is_active ?? true,
    attributes,
    options: Object.entries(attributes).map(([name, value]) => ({ name, value })),
  }
}

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
    unit: p.unit ?? undefined,
    unit_label: p.unit_label ?? undefined,
    sold_by_weight: !!p.sold_by_weight,
    quantity_step: p.quantity_step != null ? toNum(p.quantity_step) : undefined,
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
    options: p.options?.map(adaptOption),
    variants: p.variants
      ?.map(v => adaptVariant(v, p.id))
      .filter(v => v.is_active !== false),
    created_at: '',
    updated_at: '',
  }
}

export const adaptProducts = (list: ApiProduct[]): Product[] => list.map(adaptProduct)
