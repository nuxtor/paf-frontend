<script setup lang="ts">
const cmsStore = useCmsStore()

await useAsyncData('cms-home', async () => {
  await cmsStore.fetchHome()
  return true
})

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
