import type { Category } from './product'

export interface CmsHeroSlide {
  id: number
  heading: string
  subheading?: string | null
  image: string
  mobile_image?: string | null
  cta_label?: string | null
  cta_url?: string | null
  text_color?: string | null
  overlay_color?: string | null
  sort_order: number
}

export type PromoPlacement = 'homepage_top' | 'homepage_middle' | 'homepage_bottom'

export interface CmsPromoBlock {
  id: number
  title?: string | null
  subtitle?: string | null
  image: string
  link_url?: string | null
  cta_label?: string | null
  placement: PromoPlacement
  sort_order: number
}

export interface CmsTestimonial {
  id: number
  author_name: string
  author_location?: string | null
  rating: number
  quote: string
  image?: string | null
  sort_order: number
}

export interface CmsHomeResponse {
  hero_slides: CmsHeroSlide[]
  promo_blocks: Record<PromoPlacement, CmsPromoBlock[]>
  featured_categories: Category[]
  testimonials: CmsTestimonial[]
}

export interface CmsPageSummary {
  id: number
  slug: string
  title: string
  sort_order: number
}

export interface CmsPage {
  id: number
  slug: string
  title: string
  body: string
  meta_title?: string | null
  meta_description?: string | null
  updated_at: string
}

export interface CmsFaq {
  id: number
  question: string
  answer: string
  sort_order: number
}

export type CmsLinkType = 'category' | 'page' | 'url' | string

export interface CmsMenuItem {
  id: number
  label: string
  link_type: CmsLinkType
  url: string
  target?: '_self' | '_blank' | string | null
  icon?: string | null
  sort_order: number
  children: CmsMenuItem[]
}

export interface CmsMenu {
  id: number
  name: string
  slug: string
  items: CmsMenuItem[]
}
