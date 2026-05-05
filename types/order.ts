import type { Product, ProductVariant } from './product'
import type { Address } from './customer'

export interface Order {
  id: number
  order_number: string
  status: OrderStatus
  customer_id: number
  billing_address: Address
  shipping_address: Address
  items: OrderItem[]
  subtotal: number
  shipping_total: number
  tax_total: number
  discount_total: number
  total: number
  payment_status: PaymentStatus
  payment_method: string
  shipping_method: string
  tracking_number?: string
  tracking_url?: string
  notes?: string
  created_at: string
  updated_at: string
}

export interface OrderItem {
  id: number
  order_id: number
  product_id: number
  variant_id?: number
  product: Product
  variant?: ProductVariant
  name: string
  sku: string
  quantity: number
  price: number
  line_total: number
}

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded'

export type PaymentStatus =
  | 'pending'
  | 'paid'
  | 'failed'
  | 'refunded'
  | 'partially_refunded'
