import { defineStore } from 'pinia'
import type {
  CmsFaq,
  CmsHeroSlide,
  CmsMenu,
  CmsPageSummary,
  CmsPromoBlock,
  CmsTestimonial,
  PromoPlacement,
} from '~/types/cms'
import type { Category } from '~/types/product'

const emptyPromoBlocks = (): Record<PromoPlacement, CmsPromoBlock[]> => ({
  homepage_top: [],
  homepage_middle: [],
  homepage_bottom: [],
})

export const useCmsStore = defineStore('cms', () => {
  const heroSlides = ref<CmsHeroSlide[]>([])
  const promoBlocks = ref<Record<PromoPlacement, CmsPromoBlock[]>>(emptyPromoBlocks())
  const featuredCategories = ref<Category[]>([])
  const testimonials = ref<CmsTestimonial[]>([])
  const homeLoaded = ref(false)
  const homeLoading = ref(false)

  const menus = ref<Record<string, CmsMenu | null>>({})
  const menuLoading = ref<Record<string, boolean>>({})

  const pages = ref<CmsPageSummary[]>([])
  const pagesLoaded = ref(false)

  const faqs = ref<CmsFaq[]>([])
  const faqsLoaded = ref(false)

  const headerMenu = computed(() => menus.value.header ?? null)
  const footerMenu = computed(() => menus.value.footer ?? null)
  const mobileMenu = computed(() => menus.value.mobile ?? null)

  const fetchHome = async (force = false) => {
    if (homeLoaded.value && !force) return
    if (homeLoading.value) return
    const { getHome } = useCms()
    homeLoading.value = true
    try {
      const res = await getHome()
      heroSlides.value = (res.hero_slides ?? []).slice().sort((a, b) => a.sort_order - b.sort_order)
      const blocks = res.promo_blocks ?? ({} as Record<PromoPlacement, CmsPromoBlock[]>)
      promoBlocks.value = {
        homepage_top: (blocks.homepage_top ?? []).slice().sort((a, b) => a.sort_order - b.sort_order),
        homepage_middle: (blocks.homepage_middle ?? []).slice().sort((a, b) => a.sort_order - b.sort_order),
        homepage_bottom: (blocks.homepage_bottom ?? []).slice().sort((a, b) => a.sort_order - b.sort_order),
      }
      featuredCategories.value = res.featured_categories ?? []
      testimonials.value = (res.testimonials ?? []).slice().sort((a, b) => a.sort_order - b.sort_order)
      homeLoaded.value = true
    } catch (error) {
      console.error('Failed to fetch CMS home data', error)
    } finally {
      homeLoading.value = false
    }
  }

  const fetchMenu = async (slug: string, force = false) => {
    if (!force && menus.value[slug]) return menus.value[slug]
    if (menuLoading.value[slug]) return menus.value[slug] ?? null
    const { getMenu } = useCms()
    menuLoading.value = { ...menuLoading.value, [slug]: true }
    try {
      const res = await getMenu(slug)
      menus.value = { ...menus.value, [slug]: res.menu ?? null }
      return menus.value[slug]
    } catch (error) {
      console.error(`Failed to fetch CMS menu '${slug}'`, error)
      menus.value = { ...menus.value, [slug]: null }
      return null
    } finally {
      menuLoading.value = { ...menuLoading.value, [slug]: false }
    }
  }

  const fetchPages = async (force = false) => {
    if (pagesLoaded.value && !force) return
    const { getPages } = useCms()
    try {
      const res = await getPages()
      pages.value = (res.pages ?? []).slice().sort((a, b) => a.sort_order - b.sort_order)
      pagesLoaded.value = true
    } catch (error) {
      console.error('Failed to fetch CMS pages list', error)
    }
  }

  const fetchFaqs = async (force = false) => {
    if (faqsLoaded.value && !force) return
    const { getFaqs } = useCms()
    try {
      const res = await getFaqs()
      faqs.value = (res.faqs ?? []).slice().sort((a, b) => a.sort_order - b.sort_order)
      faqsLoaded.value = true
    } catch (error) {
      console.error('Failed to fetch CMS FAQs', error)
    }
  }

  return {
    heroSlides,
    promoBlocks,
    featuredCategories,
    testimonials,
    homeLoaded,
    homeLoading,
    menus,
    headerMenu,
    footerMenu,
    mobileMenu,
    pages,
    pagesLoaded,
    faqs,
    faqsLoaded,
    fetchHome,
    fetchMenu,
    fetchPages,
    fetchFaqs,
  }
})
