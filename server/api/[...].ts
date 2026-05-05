export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const backendUrl = config.apiBackendUrl as string
  const target = `${backendUrl}${event.path}`
  return proxyRequest(event, target)
})
