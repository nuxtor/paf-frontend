import type {
  CmsFaq,
  CmsHomeResponse,
  CmsMenu,
  CmsPage,
  CmsPageSummary,
} from '~/types/cms'

export const useCms = () => {
  const { apiFetch } = useApi()
  const config = useRuntimeConfig()

  const apiOrigin = computed(() => {
    const imageBase = (config.public.imageBaseUrl as string) || ''
    return imageBase.replace(/\/storage\/?$/, '').replace(/\/$/, '')
  })

  const cmsImageUrl = (path?: string | null): string => {
    if (!path) return ''
    if (/^https?:\/\//i.test(path)) return path
    const origin = apiOrigin.value
    if (path.startsWith('/')) return `${origin}${path}`
    return `${origin}/${path}`
  }

  const getHome = () => apiFetch<CmsHomeResponse>('/home')

  const getPages = () => apiFetch<{ pages: CmsPageSummary[] }>('/pages')

  const getPage = (slug: string) => apiFetch<{ page: CmsPage }>(`/pages/${slug}`)

  const getFaqs = () => apiFetch<{ faqs: CmsFaq[] }>('/faqs')

  const getMenu = (slug: string) => apiFetch<{ menu: CmsMenu }>(`/menus/${slug}`)

  return {
    cmsImageUrl,
    getHome,
    getPages,
    getPage,
    getFaqs,
    getMenu,
  }
}
