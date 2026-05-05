export interface Product {
  id: number
  name: string
  slug: string
  sku: string
  short_description: string
  description: string
  price: number
  compare_at_price?: number
  cost_price?: number
  featured_image: string
  images: ProductImage[]
  category?: Category
  category_id: number
  weight?: number
  weight_unit?: 'g' | 'kg'
  stock_quantity: number
  stock_status: 'in_stock' | 'low_stock' | 'out_of_stock'
  is_active: boolean
  is_featured: boolean
  is_new: boolean
  halal_certified: boolean
  halal_certificate_url?: string
  ingredients?: string
  allergens?: string[]
  nutritional_info?: NutritionalInfo
  has_variants: boolean
  variants?: ProductVariant[]
  meta_title?: string
  meta_description?: string
  created_at: string
  updated_at: string
}

export interface ProductVariant {
  id: number
  product_id: number
  name: string
  sku: string
  price: number
  compare_at_price?: number
  weight?: number
  weight_unit?: 'g' | 'kg'
  stock_quantity: number
  options: VariantOption[]
  image?: ProductImage
}

export interface VariantOption {
  name: string
  value: string
}

export interface ProductImage {
  id: number
  url: string
  alt?: string
  position: number
}

export interface Category {
  id: number
  name: string
  slug: string
  description?: string
  image?: string
  parent_id?: number
  children?: Category[]
  product_count?: number
}

export interface NutritionalInfo {
  calories?: number
  protein?: number
  carbohydrates?: number
  fat?: number
  fiber?: number
  sodium?: number
  serving_size?: string
}

export interface ProductFilters {
  category?: string
  search?: string
  min_price?: number
  max_price?: number
  in_stock?: boolean
  halal_certified?: boolean
  sort?: 'newest' | 'price_asc' | 'price_desc' | 'name_asc' | 'name_desc' | 'bestselling'
  page?: number
  per_page?: number
}
