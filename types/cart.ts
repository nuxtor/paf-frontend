import type { Product, ProductVariant } from './product'

// Types matching the backend API response (flattened)
export interface ApiCartItem {
  key: string
  product_id: number
  variant_id: number | null
  name: string
  variant_name: string | null
  sku: string
  image: string | null
  quantity: number
  unit_price: number
  total: number
}

export interface ApiCart {
  items: ApiCartItem[]
  item_count: number
  subtotal: number
  promotion_code: string | null
}

// Legacy types kept for compatibility
export interface Cart {
  id: string
  items: CartItem[]
  subtotal: number
  shipping_total: number
  tax_total: number
  discount_total: number
  total: number
  coupon_code?: string
  customer_type: 'retail' | 'wholesale'
}

export interface CartItem {
  id: number
  product_id: number
  variant_id?: number
  product: Product
  variant?: ProductVariant
  quantity: number
  price: number
  line_total: number
}
