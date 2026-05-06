/**
 * Composable to get asset URLs with the correct base path
 * Handles subdirectory deployments by prepending the app baseURL
 */
export const useAsset = () => {
  const config = useRuntimeConfig()
  const baseURL = config.app.baseURL || '/'

  /**
   * Get the full URL for a public asset
   * @param path - The asset path (e.g., '/images/logo.png' or 'images/logo.png')
   * @returns The full URL with base path prefix
   */
  const getAssetUrl = (path: string): string => {
    if (!path) return ''
    // Pass absolute URLs through unchanged
    if (/^https?:\/\//i.test(path)) return path
    // Remove leading slash if present
    const cleanPath = path.startsWith('/') ? path.slice(1) : path
    // Ensure baseURL ends with / and combine
    const base = baseURL.endsWith('/') ? baseURL : `${baseURL}/`
    return `${base}${cleanPath}`
  }

  return {
    getAssetUrl,
  }
}
