<script setup lang="ts">
const cmsStore = useCmsStore()

// Awaited directly rather than through useAsyncData, for the same reason as
// app.vue: the handler writes into a store and returns nothing worth
// serialising, so the prerendered payload for `/` is just `cms-home: true`.
// Arriving here by client-side navigation — the back button included — restores
// that payload, useAsyncData considers the key already resolved and never runs
// the handler, and the page renders off an empty store: no hero slides, no
// promo blocks, no testimonials, and Shop by Category falling back to the full
// category list. A reload looks fine because the prerendered HTML carries the
// store state with it. The store's own `homeLoaded` flag does the deduping.
await cmsStore.fetchHome()

useSeoMeta({
  title: 'Premium Abrahamic Foods | Quality Halal Meat & Food Delivery UK',
  description:
    'Premium halal meat and food delivered to your door. Quality certified halal beef, lamb, chicken & more. Serving UK households and wholesale buyers.',
})
</script>

<template>
  <div>
    <HeroSection />
    <PromoBlocks placement="homepage_top" />
    <WelcomeSection />
    <FeaturedCategories />
    <PromoBlocks placement="homepage_middle" />
    <LatestProducts />
    <Testimonials />
    <PromoBlocks placement="homepage_bottom" />
    <CTASection />
  </div>
</template>
