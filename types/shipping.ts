export interface ShippingRate {
  id: number
  name: string
  description: string
  carrier: string
  rate: number
  free_shipping: boolean
  delivery_estimate: string
}

export interface ShippingRateRequest {
  postcode: string
  country: string
  weight: number
  order_total: number
}
