export const ORDER_STATUSES: Record<string, { label: string; color: string }> = {
  pending: { label: 'Pending', color: 'warning' },
  confirmed: { label: 'Confirmed', color: 'secondary' },
  processing: { label: 'Processing', color: 'secondary' },
  ready_to_ship: { label: 'Ready to Ship', color: 'secondary' },
  shipped: { label: 'Shipped', color: 'primary' },
  out_for_delivery: { label: 'Out for Delivery', color: 'primary' },
  delivered: { label: 'Delivered', color: 'success' },
  cancelled: { label: 'Cancelled', color: 'error' },
  refunded: { label: 'Refunded', color: 'default' },
  partially_refunded: { label: 'Partially Refunded', color: 'warning' },
}

export const PAYMENT_STATUSES: Record<string, { label: string; color: string }> = {
  pending: { label: 'Pending', color: 'warning' },
  paid: { label: 'Paid', color: 'success' },
  failed: { label: 'Failed', color: 'error' },
  refunded: { label: 'Refunded', color: 'default' },
  partially_refunded: { label: 'Partially Refunded', color: 'warning' },
}

export const MAX_CART_QUANTITY = 99
export const MIN_WHOLESALE_ORDER = 150
export const FREE_DELIVERY_THRESHOLD = 100

export const ALLERGENS = [
  'Celery',
  'Cereals containing gluten',
  'Crustaceans',
  'Eggs',
  'Fish',
  'Lupin',
  'Milk',
  'Molluscs',
  'Mustard',
  'Nuts',
  'Peanuts',
  'Sesame seeds',
  'Soya',
  'Sulphur dioxide',
] as const

export const PRODUCT_SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'name_asc', label: 'Name: A to Z' },
  { value: 'name_desc', label: 'Name: Z to A' },
  { value: 'bestselling', label: 'Best Selling' },
] as const

export const MAIN_CATEGORIES = [
  {
    name: 'Meat',
    slug: 'meat',
    children: [
      { name: 'Beef', slug: 'beef' },
      { name: 'Lamb', slug: 'lamb' },
      { name: 'Goat', slug: 'goat' },
      { name: 'Mince', slug: 'mince' },
    ],
  },
  {
    name: 'Poultry',
    slug: 'poultry',
    children: [
      { name: 'Chicken', slug: 'chicken' },
      { name: 'Turkey', slug: 'turkey' },
      { name: 'Duck', slug: 'duck' },
    ],
  },
  {
    name: 'Seafood',
    slug: 'seafood',
    children: [
      { name: 'Fish', slug: 'fish' },
      { name: 'Prawns', slug: 'prawns' },
      { name: 'Salmon', slug: 'salmon' },
    ],
  },
  {
    name: 'Groceries',
    slug: 'groceries',
    children: [
      { name: 'Spices', slug: 'spices' },
      { name: 'Rice & Grains', slug: 'rice-grains' },
      { name: 'Oils', slug: 'oils' },
      { name: 'Sauces', slug: 'sauces' },
    ],
  },
]

export const NAV_LINKS = [
  { name: 'Home', path: '/' },
  { name: 'About Us', path: '/about-us' },
  { name: 'Wholesale', path: '/wholesale' },
  { name: 'Delivery', path: '/delivery' },
  { name: 'Contact', path: '/contact' },
] as const

export const SHOP_HOURS = [
  { days: 'Monday - Friday', time: '9am - 6pm' },
  { days: 'Saturday', time: '10am - 4pm' },
] as const

export const CONTACT_PHONES = [
  { number: '07930 594 995', hours: '10am to 5pm', whatsapp: true },
  { number: '07538 514 355', hours: '10am to 5pm', whatsapp: true },
  { number: '020 8478 0552', hours: '3pm to 6pm', whatsapp: false },
] as const

export const FOOTER_POLICIES = [
  { name: 'Alternative Products', path: '/policies/alternative-products' },
  { name: 'Delivery Policy', path: '/policies/delivery' },
  { name: 'Refund Policy', path: '/policies/refund' },
  { name: 'Privacy Policy', path: '/policies/privacy' },
] as const

export const FOOTER_INFO = [
  { name: 'About Us', path: '/about-us' },
  { name: 'Customer Service', path: '/contact' },
  { name: 'Terms and Conditions', path: '/terms' },
  { name: 'FAQs', path: '/faqs' },
] as const
