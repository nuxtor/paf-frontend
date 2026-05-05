<script setup lang="ts">
import type { Product } from '~/types/product'
import { PRODUCT_SORT_OPTIONS, MAIN_CATEGORIES } from '~/utils/constants'

const route = useRoute()
const categorySlug = route.params.category as string
const subcategorySlug = route.params.subcategory as string
const { getAssetUrl } = useAsset()

// Find parent category and subcategory from constants
const parentCategory = computed(() =>
  MAIN_CATEGORIES.find(c => c.slug === categorySlug)
)

const subcategory = computed(() =>
  parentCategory.value?.children?.find(c => c.slug === subcategorySlug)
)

// Demo products for subcategories
const subcategoryProducts: Record<string, Product[]> = {
  // Meat subcategories
  beef: [
    {
      id: 101,
      name: 'Premium Halal Beef Ribeye Steak',
      slug: 'premium-halal-beef-ribeye-steak',
      sku: 'BEEF-001',
      short_description: 'Tender and flavourful ribeye steak, perfect for grilling',
      description: '',
      price: 24.99,
      featured_image: 'images/products/meat-products-01.jpg',
      images: [],
      category: { id: 1, name: 'Beef', slug: 'beef' },
      category_id: 1,
      stock_quantity: 30,
      stock_status: 'in_stock',
      is_active: true,
      is_featured: true,
      is_new: true,
      halal_certified: true,
      has_variants: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 102,
      name: 'Halal Beef Mince 500g',
      slug: 'halal-beef-mince-500g',
      sku: 'BEEF-002',
      short_description: 'Lean beef mince, ideal for burgers and bolognese',
      description: '',
      price: 8.99,
      featured_image: 'images/products/meat-products-02.jpg',
      images: [],
      category: { id: 1, name: 'Beef', slug: 'beef' },
      category_id: 1,
      stock_quantity: 50,
      stock_status: 'in_stock',
      is_active: true,
      is_featured: false,
      is_new: false,
      halal_certified: true,
      has_variants: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 103,
      name: 'Halal Beef Sirloin Joint 1kg',
      slug: 'halal-beef-sirloin-joint-1kg',
      sku: 'BEEF-003',
      short_description: 'Perfect for Sunday roast, tender and juicy',
      description: '',
      price: 18.99,
      featured_image: 'images/products/meat-products-03.jpg',
      images: [],
      category: { id: 1, name: 'Beef', slug: 'beef' },
      category_id: 1,
      stock_quantity: 25,
      stock_status: 'in_stock',
      is_active: true,
      is_featured: true,
      is_new: false,
      halal_certified: true,
      has_variants: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 104,
      name: 'Halal Beef Brisket',
      slug: 'halal-beef-brisket',
      sku: 'BEEF-004',
      short_description: 'Slow cook for melt-in-mouth tenderness',
      description: '',
      price: 14.99,
      featured_image: 'images/products/meat-products-04.jpg',
      images: [],
      category: { id: 1, name: 'Beef', slug: 'beef' },
      category_id: 1,
      stock_quantity: 20,
      stock_status: 'in_stock',
      is_active: true,
      is_featured: false,
      is_new: false,
      halal_certified: true,
      has_variants: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ],
  lamb: [
    {
      id: 201,
      name: 'Halal Lamb Leg Whole',
      slug: 'halal-lamb-leg-whole',
      sku: 'LAMB-101',
      short_description: 'Whole lamb leg, perfect for roasting',
      description: '',
      price: 32.99,
      featured_image: 'images/products/meat-products-07.jpg',
      images: [],
      category: { id: 2, name: 'Lamb', slug: 'lamb' },
      category_id: 2,
      stock_quantity: 15,
      stock_status: 'in_stock',
      is_active: true,
      is_featured: true,
      is_new: false,
      halal_certified: true,
      has_variants: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 202,
      name: 'Halal Lamb Chops 500g',
      slug: 'halal-lamb-chops-500g',
      sku: 'LAMB-102',
      short_description: 'Succulent lamb chops, great for BBQ',
      description: '',
      price: 14.99,
      featured_image: 'images/products/meat-products-08.jpg',
      images: [],
      category: { id: 2, name: 'Lamb', slug: 'lamb' },
      category_id: 2,
      stock_quantity: 40,
      stock_status: 'in_stock',
      is_active: true,
      is_featured: false,
      is_new: true,
      halal_certified: true,
      has_variants: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 203,
      name: 'Halal Lamb Shoulder',
      slug: 'halal-lamb-shoulder',
      sku: 'LAMB-103',
      short_description: 'Slow roast for tender, falling-off-the-bone meat',
      description: '',
      price: 22.99,
      featured_image: 'images/products/meat-products-09.jpg',
      images: [],
      category: { id: 2, name: 'Lamb', slug: 'lamb' },
      category_id: 2,
      stock_quantity: 18,
      stock_status: 'in_stock',
      is_active: true,
      is_featured: true,
      is_new: false,
      halal_certified: true,
      has_variants: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 204,
      name: 'Halal Lamb Mince 500g',
      slug: 'halal-lamb-mince-500g',
      sku: 'LAMB-104',
      short_description: 'Premium lamb mince for keema and kofta',
      description: '',
      price: 9.99,
      featured_image: 'images/products/meat-products-10.jpg',
      images: [],
      category: { id: 2, name: 'Lamb', slug: 'lamb' },
      category_id: 2,
      stock_quantity: 45,
      stock_status: 'in_stock',
      is_active: true,
      is_featured: false,
      is_new: false,
      halal_certified: true,
      has_variants: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ],
  goat: [
    {
      id: 301,
      name: 'Halal Goat Curry Cut 1kg',
      slug: 'halal-goat-curry-cut-1kg',
      sku: 'GOAT-001',
      short_description: 'Bone-in goat meat, perfect for curries',
      description: '',
      price: 16.99,
      featured_image: 'images/products/meat-products-05.jpg',
      images: [],
      category: { id: 3, name: 'Goat', slug: 'goat' },
      category_id: 3,
      stock_quantity: 25,
      stock_status: 'in_stock',
      is_active: true,
      is_featured: true,
      is_new: false,
      halal_certified: true,
      has_variants: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 302,
      name: 'Halal Goat Leg',
      slug: 'halal-goat-leg',
      sku: 'GOAT-002',
      short_description: 'Whole goat leg for special occasions',
      description: '',
      price: 28.99,
      featured_image: 'images/products/meat-products-06.jpg',
      images: [],
      category: { id: 3, name: 'Goat', slug: 'goat' },
      category_id: 3,
      stock_quantity: 12,
      stock_status: 'in_stock',
      is_active: true,
      is_featured: false,
      is_new: true,
      halal_certified: true,
      has_variants: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 303,
      name: 'Halal Goat Shoulder',
      slug: 'halal-goat-shoulder',
      sku: 'GOAT-003',
      short_description: 'Tender shoulder cut for slow cooking',
      description: '',
      price: 19.99,
      featured_image: 'images/products/meat-products-01.jpg',
      images: [],
      category: { id: 3, name: 'Goat', slug: 'goat' },
      category_id: 3,
      stock_quantity: 15,
      stock_status: 'in_stock',
      is_active: true,
      is_featured: false,
      is_new: false,
      halal_certified: true,
      has_variants: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ],
  mince: [
    {
      id: 401,
      name: 'Mixed Halal Mince 500g',
      slug: 'mixed-halal-mince-500g',
      sku: 'MINCE-001',
      short_description: 'Beef and lamb blend mince',
      description: '',
      price: 7.99,
      featured_image: 'images/products/meat-products-02.jpg',
      images: [],
      category: { id: 4, name: 'Mince', slug: 'mince' },
      category_id: 4,
      stock_quantity: 60,
      stock_status: 'in_stock',
      is_active: true,
      is_featured: true,
      is_new: false,
      halal_certified: true,
      has_variants: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 402,
      name: 'Lean Halal Beef Mince 500g',
      slug: 'lean-halal-beef-mince-500g',
      sku: 'MINCE-002',
      short_description: 'Extra lean beef mince, less than 5% fat',
      description: '',
      price: 9.99,
      featured_image: 'images/products/meat-products-03.jpg',
      images: [],
      category: { id: 4, name: 'Mince', slug: 'mince' },
      category_id: 4,
      stock_quantity: 40,
      stock_status: 'in_stock',
      is_active: true,
      is_featured: false,
      is_new: true,
      halal_certified: true,
      has_variants: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ],
  // Poultry subcategories
  chicken: [
    {
      id: 501,
      name: 'Halal Whole Chicken',
      slug: 'halal-whole-chicken',
      sku: 'CHICK-001',
      short_description: 'Fresh whole chicken, approximately 1.5kg',
      description: '',
      price: 8.99,
      featured_image: 'images/products/meat-products-04.jpg',
      images: [],
      category: { id: 5, name: 'Chicken', slug: 'chicken' },
      category_id: 5,
      stock_quantity: 50,
      stock_status: 'in_stock',
      is_active: true,
      is_featured: true,
      is_new: false,
      halal_certified: true,
      has_variants: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 502,
      name: 'Halal Chicken Breast 1kg',
      slug: 'halal-chicken-breast-1kg',
      sku: 'CHICK-002',
      short_description: 'Skinless chicken breast fillets',
      description: '',
      price: 12.99,
      featured_image: 'images/products/meat-products-05.jpg',
      images: [],
      category: { id: 5, name: 'Chicken', slug: 'chicken' },
      category_id: 5,
      stock_quantity: 80,
      stock_status: 'in_stock',
      is_active: true,
      is_featured: true,
      is_new: false,
      halal_certified: true,
      has_variants: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 503,
      name: 'Halal Chicken Thighs 1kg',
      slug: 'halal-chicken-thighs-1kg',
      sku: 'CHICK-003',
      short_description: 'Bone-in chicken thighs, full of flavour',
      description: '',
      price: 7.99,
      featured_image: 'images/products/meat-products-06.jpg',
      images: [],
      category: { id: 5, name: 'Chicken', slug: 'chicken' },
      category_id: 5,
      stock_quantity: 60,
      stock_status: 'in_stock',
      is_active: true,
      is_featured: false,
      is_new: false,
      halal_certified: true,
      has_variants: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 504,
      name: 'Halal Chicken Wings 1kg',
      slug: 'halal-chicken-wings-1kg',
      sku: 'CHICK-004',
      short_description: 'Party favourite chicken wings',
      description: '',
      price: 6.99,
      featured_image: 'images/products/meat-products-07.jpg',
      images: [],
      category: { id: 5, name: 'Chicken', slug: 'chicken' },
      category_id: 5,
      stock_quantity: 70,
      stock_status: 'in_stock',
      is_active: true,
      is_featured: false,
      is_new: true,
      halal_certified: true,
      has_variants: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ],
  turkey: [
    {
      id: 601,
      name: 'Halal Turkey Breast 1kg',
      slug: 'halal-turkey-breast-1kg',
      sku: 'TURK-001',
      short_description: 'Lean turkey breast joint',
      description: '',
      price: 14.99,
      featured_image: 'images/products/meat-products-08.jpg',
      images: [],
      category: { id: 6, name: 'Turkey', slug: 'turkey' },
      category_id: 6,
      stock_quantity: 20,
      stock_status: 'in_stock',
      is_active: true,
      is_featured: true,
      is_new: false,
      halal_certified: true,
      has_variants: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 602,
      name: 'Halal Turkey Mince 500g',
      slug: 'halal-turkey-mince-500g',
      sku: 'TURK-002',
      short_description: 'Lean turkey mince, healthy alternative',
      description: '',
      price: 6.99,
      featured_image: 'images/products/meat-products-09.jpg',
      images: [],
      category: { id: 6, name: 'Turkey', slug: 'turkey' },
      category_id: 6,
      stock_quantity: 35,
      stock_status: 'in_stock',
      is_active: true,
      is_featured: false,
      is_new: true,
      halal_certified: true,
      has_variants: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ],
  duck: [
    {
      id: 701,
      name: 'Halal Whole Duck',
      slug: 'halal-whole-duck',
      sku: 'DUCK-001',
      short_description: 'Fresh whole duck, approximately 2kg',
      description: '',
      price: 18.99,
      featured_image: 'images/products/meat-products-10.jpg',
      images: [],
      category: { id: 7, name: 'Duck', slug: 'duck' },
      category_id: 7,
      stock_quantity: 10,
      stock_status: 'in_stock',
      is_active: true,
      is_featured: true,
      is_new: false,
      halal_certified: true,
      has_variants: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 702,
      name: 'Halal Duck Breast',
      slug: 'halal-duck-breast',
      sku: 'DUCK-002',
      short_description: 'Premium duck breast fillets',
      description: '',
      price: 12.99,
      featured_image: 'images/products/meat-products-01.jpg',
      images: [],
      category: { id: 7, name: 'Duck', slug: 'duck' },
      category_id: 7,
      stock_quantity: 15,
      stock_status: 'in_stock',
      is_active: true,
      is_featured: false,
      is_new: true,
      halal_certified: true,
      has_variants: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ],
  // Seafood subcategories
  fish: [
    {
      id: 801,
      name: 'Fresh Salmon Fillet 500g',
      slug: 'fresh-salmon-fillet-500g',
      sku: 'FISH-001',
      short_description: 'Premium Atlantic salmon fillets',
      description: '',
      price: 14.99,
      featured_image: 'images/products/meat-products-02.jpg',
      images: [],
      category: { id: 8, name: 'Fish', slug: 'fish' },
      category_id: 8,
      stock_quantity: 30,
      stock_status: 'in_stock',
      is_active: true,
      is_featured: true,
      is_new: false,
      halal_certified: true,
      has_variants: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 802,
      name: 'Fresh Cod Loin 500g',
      slug: 'fresh-cod-loin-500g',
      sku: 'FISH-002',
      short_description: 'Thick cod loin portions',
      description: '',
      price: 12.99,
      featured_image: 'images/products/meat-products-03.jpg',
      images: [],
      category: { id: 8, name: 'Fish', slug: 'fish' },
      category_id: 8,
      stock_quantity: 25,
      stock_status: 'in_stock',
      is_active: true,
      is_featured: false,
      is_new: false,
      halal_certified: true,
      has_variants: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 803,
      name: 'Fresh Sea Bass',
      slug: 'fresh-sea-bass',
      sku: 'FISH-003',
      short_description: 'Whole sea bass, scales removed',
      description: '',
      price: 9.99,
      featured_image: 'images/products/meat-products-04.jpg',
      images: [],
      category: { id: 8, name: 'Fish', slug: 'fish' },
      category_id: 8,
      stock_quantity: 20,
      stock_status: 'in_stock',
      is_active: true,
      is_featured: true,
      is_new: true,
      halal_certified: true,
      has_variants: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ],
  prawns: [
    {
      id: 901,
      name: 'King Prawns 500g',
      slug: 'king-prawns-500g',
      sku: 'PRAWN-001',
      short_description: 'Large king prawns, shell on',
      description: '',
      price: 12.99,
      featured_image: 'images/products/meat-products-05.jpg',
      images: [],
      category: { id: 9, name: 'Prawns', slug: 'prawns' },
      category_id: 9,
      stock_quantity: 40,
      stock_status: 'in_stock',
      is_active: true,
      is_featured: true,
      is_new: false,
      halal_certified: true,
      has_variants: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 902,
      name: 'Tiger Prawns 500g',
      slug: 'tiger-prawns-500g',
      sku: 'PRAWN-002',
      short_description: 'Jumbo tiger prawns, peeled and deveined',
      description: '',
      price: 14.99,
      featured_image: 'images/products/meat-products-06.jpg',
      images: [],
      category: { id: 9, name: 'Prawns', slug: 'prawns' },
      category_id: 9,
      stock_quantity: 35,
      stock_status: 'in_stock',
      is_active: true,
      is_featured: false,
      is_new: true,
      halal_certified: true,
      has_variants: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 903,
      name: 'Cooked Prawns 300g',
      slug: 'cooked-prawns-300g',
      sku: 'PRAWN-003',
      short_description: 'Ready to eat cooked prawns',
      description: '',
      price: 8.99,
      featured_image: 'images/products/meat-products-07.jpg',
      images: [],
      category: { id: 9, name: 'Prawns', slug: 'prawns' },
      category_id: 9,
      stock_quantity: 45,
      stock_status: 'in_stock',
      is_active: true,
      is_featured: false,
      is_new: false,
      halal_certified: true,
      has_variants: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ],
  salmon: [
    {
      id: 1001,
      name: 'Smoked Salmon 200g',
      slug: 'smoked-salmon-200g',
      sku: 'SALM-001',
      short_description: 'Scottish smoked salmon slices',
      description: '',
      price: 8.99,
      featured_image: 'images/products/meat-products-08.jpg',
      images: [],
      category: { id: 10, name: 'Salmon', slug: 'salmon' },
      category_id: 10,
      stock_quantity: 30,
      stock_status: 'in_stock',
      is_active: true,
      is_featured: true,
      is_new: false,
      halal_certified: true,
      has_variants: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 1002,
      name: 'Salmon Steaks 500g',
      slug: 'salmon-steaks-500g',
      sku: 'SALM-002',
      short_description: 'Thick cut salmon steaks with bone',
      description: '',
      price: 11.99,
      featured_image: 'images/products/meat-products-09.jpg',
      images: [],
      category: { id: 10, name: 'Salmon', slug: 'salmon' },
      category_id: 10,
      stock_quantity: 25,
      stock_status: 'in_stock',
      is_active: true,
      is_featured: false,
      is_new: true,
      halal_certified: true,
      has_variants: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ],
  // Groceries subcategories
  spices: [
    {
      id: 1101,
      name: 'Premium Garam Masala 100g',
      slug: 'premium-garam-masala-100g',
      sku: 'SPICE-001',
      short_description: 'Authentic blend of aromatic spices',
      description: '',
      price: 3.99,
      featured_image: 'images/products/meat-products-10.jpg',
      images: [],
      category: { id: 11, name: 'Spices', slug: 'spices' },
      category_id: 11,
      stock_quantity: 100,
      stock_status: 'in_stock',
      is_active: true,
      is_featured: true,
      is_new: false,
      halal_certified: true,
      has_variants: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 1102,
      name: 'Turmeric Powder 100g',
      slug: 'turmeric-powder-100g',
      sku: 'SPICE-002',
      short_description: 'Pure ground turmeric',
      description: '',
      price: 2.49,
      featured_image: 'images/products/meat-products-01.jpg',
      images: [],
      category: { id: 11, name: 'Spices', slug: 'spices' },
      category_id: 11,
      stock_quantity: 120,
      stock_status: 'in_stock',
      is_active: true,
      is_featured: false,
      is_new: false,
      halal_certified: true,
      has_variants: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ],
  'rice-grains': [
    {
      id: 1201,
      name: 'Basmati Rice 5kg',
      slug: 'basmati-rice-5kg',
      sku: 'RICE-001',
      short_description: 'Premium aged basmati rice',
      description: '',
      price: 12.99,
      featured_image: 'images/products/meat-products-02.jpg',
      images: [],
      category: { id: 12, name: 'Rice & Grains', slug: 'rice-grains' },
      category_id: 12,
      stock_quantity: 50,
      stock_status: 'in_stock',
      is_active: true,
      is_featured: true,
      is_new: false,
      halal_certified: true,
      has_variants: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 1202,
      name: 'Brown Basmati Rice 2kg',
      slug: 'brown-basmati-rice-2kg',
      sku: 'RICE-002',
      short_description: 'Wholegrain basmati rice',
      description: '',
      price: 6.99,
      featured_image: 'images/products/meat-products-03.jpg',
      images: [],
      category: { id: 12, name: 'Rice & Grains', slug: 'rice-grains' },
      category_id: 12,
      stock_quantity: 40,
      stock_status: 'in_stock',
      is_active: true,
      is_featured: false,
      is_new: true,
      halal_certified: true,
      has_variants: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ],
  oils: [
    {
      id: 1301,
      name: 'Extra Virgin Olive Oil 1L',
      slug: 'extra-virgin-olive-oil-1l',
      sku: 'OIL-001',
      short_description: 'Cold pressed extra virgin olive oil',
      description: '',
      price: 9.99,
      featured_image: 'images/products/meat-products-04.jpg',
      images: [],
      category: { id: 13, name: 'Oils', slug: 'oils' },
      category_id: 13,
      stock_quantity: 60,
      stock_status: 'in_stock',
      is_active: true,
      is_featured: true,
      is_new: false,
      halal_certified: true,
      has_variants: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ],
  sauces: [
    {
      id: 1401,
      name: 'Tikka Masala Sauce 500g',
      slug: 'tikka-masala-sauce-500g',
      sku: 'SAUCE-001',
      short_description: 'Authentic tikka masala cooking sauce',
      description: '',
      price: 3.49,
      featured_image: 'images/products/meat-products-05.jpg',
      images: [],
      category: { id: 14, name: 'Sauces', slug: 'sauces' },
      category_id: 14,
      stock_quantity: 80,
      stock_status: 'in_stock',
      is_active: true,
      is_featured: true,
      is_new: false,
      halal_certified: true,
      has_variants: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 1402,
      name: 'Korma Sauce 500g',
      slug: 'korma-sauce-500g',
      sku: 'SAUCE-002',
      short_description: 'Creamy mild korma cooking sauce',
      description: '',
      price: 3.49,
      featured_image: 'images/products/meat-products-06.jpg',
      images: [],
      category: { id: 14, name: 'Sauces', slug: 'sauces' },
      category_id: 14,
      stock_quantity: 75,
      stock_status: 'in_stock',
      is_active: true,
      is_featured: false,
      is_new: true,
      halal_certified: true,
      has_variants: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ],
}

const products = computed(() => subcategoryProducts[subcategorySlug] || [])

const filters = ref({
  sort: (route.query.sort as string) || 'newest',
})

useSeoMeta({
  title: () => `${subcategory.value?.name || subcategorySlug} | ${parentCategory.value?.name || categorySlug} | Premium Abrahimic Foods`,
  description: () => `Browse our premium halal ${subcategory.value?.name?.toLowerCase() || subcategorySlug} products. Quality certified, delivered fresh.`,
})

const breadcrumbs = computed(() => [
  { label: 'Products', to: '/products' },
  { label: parentCategory.value?.name || categorySlug, to: `/categories/${categorySlug}` },
  { label: subcategory.value?.name || subcategorySlug },
])
</script>

<template>
  <div class="bg-gray-50 dark:bg-pif-black min-h-screen">
    <!-- Subcategory Hero -->
    <div class="relative h-48 md:h-64 bg-pif-green-dark">
      <div class="absolute inset-0 bg-gradient-to-r from-pif-green-dark to-pif-green opacity-90" />
      <div class="absolute inset-0 flex items-center justify-center">
        <div class="text-center">
          <p class="text-pif-gold text-sm uppercase tracking-wider mb-2">
            {{ parentCategory?.name }}
          </p>
          <h1 class="font-heading text-4xl md:text-5xl text-white">
            {{ subcategory?.name || subcategorySlug }}
          </h1>
        </div>
      </div>
    </div>

    <div class="container py-8">
      <TheBreadcrumb :items="breadcrumbs" />

      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <p class="text-gray-600 dark:text-gray-400">
          {{ products.length }} products
        </p>

        <!-- Sort -->
        <div class="flex items-center gap-4">
          <select
            v-model="filters.sort"
            class="px-4 py-2 border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-200 text-pif-black dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-pif-green dark:focus:ring-pif-gold"
          >
            <option v-for="option in PRODUCT_SORT_OPTIONS" :key="option.value" :value="option.value">
              {{ option.label }}
            </option>
          </select>
        </div>
      </div>

      <!-- Products Grid -->
      <div v-if="products.length === 0" class="text-center py-20">
        <Icon name="heroicons:shopping-bag" class="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
        <h2 class="text-xl font-medium text-gray-700 dark:text-gray-300 mb-2">No products found</h2>
        <p class="text-gray-500 dark:text-gray-400 mb-6">Check back soon for new arrivals in this category.</p>
        <NuxtLink
          :to="`/categories/${categorySlug}`"
          class="inline-flex items-center gap-2 px-6 py-3 bg-pif-green-dark dark:bg-pif-gold text-white dark:text-pif-black font-medium rounded-lg hover:bg-pif-green dark:hover:bg-pif-gold-light transition-colors"
        >
          <Icon name="heroicons:arrow-left" class="w-5 h-5" />
          Back to {{ parentCategory?.name }}
        </NuxtLink>
      </div>

      <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        <article
          v-for="product in products"
          :key="product.id"
          class="group relative bg-white dark:bg-dark-200 rounded-xl shadow-sm hover:shadow-md dark:shadow-black/50 transition-shadow border border-transparent dark:border-dark-600"
        >
          <!-- Image -->
          <NuxtLink
            :to="`/products/${product.slug}`"
            class="block aspect-square overflow-hidden rounded-t-xl"
          >
            <img
              :src="getAssetUrl(product.featured_image)"
              :alt="product.name"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </NuxtLink>

          <!-- Badges -->
          <div class="absolute top-3 left-3 flex flex-col gap-2">
            <PBadge v-if="product.is_new" variant="gold">New</PBadge>
            <PBadge v-if="product.halal_certified" variant="success">
              <Icon name="heroicons:check-badge" class="w-3 h-3 mr-1" />
              Halal
            </PBadge>
          </div>

          <!-- Content -->
          <div class="p-4">
            <p class="text-xs text-pif-green dark:text-pif-gold mb-1">
              {{ product.category?.name }}
            </p>
            <NuxtLink :to="`/products/${product.slug}`">
              <h3 class="font-medium text-sm text-pif-black dark:text-white line-clamp-2 hover:text-pif-green-dark dark:hover:text-pif-gold transition-colors">
                {{ product.name }}
              </h3>
            </NuxtLink>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
              {{ product.short_description }}
            </p>
            <p class="text-pif-green-dark dark:text-pif-gold font-semibold mt-2">
              {{ formatCurrency(product.price) }}
            </p>
          </div>
        </article>
      </div>

      <!-- Back to Parent Category -->
      <div class="text-center mt-12">
        <NuxtLink
          :to="`/categories/${categorySlug}`"
          class="inline-flex items-center gap-2 text-pif-green-dark dark:text-pif-gold hover:underline"
        >
          <Icon name="heroicons:arrow-left" class="w-5 h-5" />
          View all {{ parentCategory?.name }}
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
