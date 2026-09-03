// These mirror the API's OrderResource / OrderItemResource exactly. Money
// fields arrive as decimal strings from MySQL, so anything that does maths on
// them has to parse first — `formatCurrency` is happy with either.
export type Money = string | number

export interface OrderAddress {
  first_name?: string
  last_name?: string
  company?: string
  address_line_1?: string
  address_line_2?: string
  city?: string
  county?: string
  postcode?: string
  country?: string
  phone?: string
}

export interface Order {
  id: number
  order_number: string
  status: OrderStatus
  payment_status: PaymentStatus
  subtotal: Money
  discount_amount: Money
  shipping_amount: Money
  tax_amount: Money
  total: Money
  currency: string
  shipping_address: OrderAddress
  billing_address: OrderAddress
  shipping_method?: string
  promotion_code?: string
  customer_notes?: string
  items?: OrderItem[]
  shipments?: Shipment[]
  paid_at?: string | null
  shipped_at?: string | null
  delivered_at?: string | null
  created_at: string
}

export interface OrderItem {
  id: number
  product_id: number
  variant_id?: number | null
  product_name: string
  variant_name?: string | null
  options?: Record<string, string> | null
  sku: string
  note?: string | null
  quantity: number
  unit?: string | null
  unit_price: Money
  subtotal: Money
  discount_amount: Money
  total: Money
}

export interface Shipment {
  id: number
  carrier?: string | null
  tracking_number?: string | null
  tracking_url?: string | null
  status: string
  shipped_at?: string | null
  delivered_at?: string | null
}

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'ready_to_ship'
  | 'shipped'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled'
  | 'refunded'
  | 'partially_refunded'

export type PaymentStatus =
  | 'pending'
  | 'paid'
  | 'failed'
  | 'refunded'
  | 'partially_refunded'
