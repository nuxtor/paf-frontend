export interface Customer {
  id: number
  email: string
  first_name: string
  last_name: string
  phone?: string
  customer_type: 'retail' | 'wholesale'
  wholesale_status?: 'pending' | 'approved' | 'rejected'
  company_name?: string
  vat_number?: string
  default_billing_address_id?: number
  default_shipping_address_id?: number
  addresses: Address[]
  created_at: string
}

export interface Address {
  id: number
  label?: string
  first_name: string
  last_name: string
  company?: string
  address_line_1: string
  address_line_2?: string
  city: string
  county?: string
  postcode: string
  country: string
  phone?: string
  is_default_billing: boolean
  is_default_shipping: boolean
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  first_name: string
  last_name: string
  email: string
  password: string
  password_confirmation: string
  phone?: string
}
