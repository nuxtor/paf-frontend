import { loadStripe } from '@stripe/stripe-js'
import type { Stripe } from '@stripe/stripe-js'

export default defineNuxtPlugin(async () => {
  const config = useRuntimeConfig()
  const key = config.public.stripePublishableKey as string

  let stripe: Stripe | null = null

  if (key) {
    stripe = await loadStripe(key)
  }

  return {
    provide: {
      stripe,
    },
  }
})
