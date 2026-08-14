/**
 * The site logo, as set in the admin under Settings > Branding.
 *
 * Falls back to the logo bundled with the build: GET /site returns null for
 * `logo` until someone uploads one, and the header cannot render nothing. The
 * alt text falls back the same way, so it is never empty.
 */
export const useSiteLogo = () => {
  const cmsStore = useCmsStore()
  const config = useRuntimeConfig()
  const { getAssetUrl } = useAsset()

  const src = computed(() => cmsStore.siteLogo || getAssetUrl('images/logo.png'))
  const alt = computed(() => cmsStore.siteLogoAlt || (config.public.siteName as string))

  return { src, alt }
}
