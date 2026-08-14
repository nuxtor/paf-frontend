<script setup lang="ts">
const { getAssetUrl } = useAsset()

const backgroundStyle = computed(() => ({
  backgroundImage: `url('${getAssetUrl('images/meat-slides-02.jpg')}')`
}))
</script>

<template>
  <section class="relative py-20 md:py-28 overflow-hidden">
    <!-- Parallax Background -->
    <div
      class="absolute inset-0 bg-cover bg-center bg-fixed"
      :style="backgroundStyle"
    />
    <div class="absolute inset-0 bg-pif-green-dark/80" />

    <!-- Content -->
    <div class="relative container">
      <div class="max-w-2xl mx-auto text-center text-white">
        <h2 class="font-heading text-3xl md:text-4xl lg:text-5xl mb-6">
          Premium Quality, Delivered Fresh
        </h2>
        <p class="text-lg md:text-xl text-white/90 mb-8">
          Join thousands of satisfied customers who trust Premium Abrahamic Foods for their halal
          meat and grocery needs. Experience the difference that quality makes.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <NuxtLink
            to="/products"
            class="inline-flex items-center justify-center gap-2 px-6 py-3 bg-pif-gold text-pif-black font-medium rounded-lg hover:bg-pif-gold-light transition-colors"
          >
            Shop Now
            <Icon name="heroicons:arrow-right" class="w-5 h-5" />
          </NuxtLink>
          <NuxtLink
            to="/wholesale"
            class="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-white text-white font-medium rounded-lg hover:bg-white hover:text-pif-green-dark transition-colors"
          >
            Wholesale Enquiries
          </NuxtLink>
        </div>
      </div>
    </div>
  </section>
</template>
