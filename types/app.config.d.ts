declare module 'nuxt/schema' {
  interface AppConfig {
    siteName: string
    siteTagline: string
    contact: {
      email: string
      phone: string
    }
    social: {
      facebook: string
      instagram: string
      twitter: string
    }
    freeDeliveryThreshold: number
  }
}

export {}
