<script setup lang="ts">
const { getAssetUrl } = useAsset()

const slides = [
  {
    id: 1,
    image: 'images/meat-slides-01.jpg',
    title: 'Premium Halal Meat',
    subtitle: 'Quality you can trust, delivered to your door',
    cta: { label: 'Shop Now', link: '/products' },
  },
  {
    id: 2,
    image: 'images/meat-slides-02.jpg',
    title: 'Fresh & Certified',
    subtitle: '100% Halal certified products',
    cta: { label: 'Learn More', link: '/halal-promise' },
  },
  {
    id: 3,
    image: 'images/meat-slides-03.jpg',
    title: 'Wholesale Available',
    subtitle: 'Special pricing for businesses',
    cta: { label: 'Apply Now', link: '/wholesale' },
  },
  {
    id: 4,
    image: 'images/meat-slides-04.jpg',
    title: 'Free Delivery',
    subtitle: 'On orders over £50',
    cta: { label: 'Start Shopping', link: '/products' },
  },
]

const currentSlide = ref(0)
let slideInterval: ReturnType<typeof setInterval> | null = null

const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % slides.length
}

const prevSlide = () => {
  currentSlide.value = (currentSlide.value - 1 + slides.length) % slides.length
}

const goToSlide = (index: number) => {
  currentSlide.value = index
  resetInterval()
}

const resetInterval = () => {
  if (slideInterval) {
    clearInterval(slideInterval)
  }
  slideInterval = setInterval(nextSlide, 5000)
}

onMounted(() => {
  resetInterval()
})

onUnmounted(() => {
  if (slideInterval) {
    clearInterval(slideInterval)
  }
})
</script>

<template>
  <section class="relative h-[400px] md:h-[500px] lg:h-[600px] bg-pif-green-dark overflow-hidden">
    <!-- Slides -->
    <div class="relative h-full">
      <TransitionGroup
        enter-active-class="transition-opacity duration-1000 ease-in-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition-opacity duration-1000 ease-in-out absolute inset-0"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-for="(slide, index) in slides"
          v-show="currentSlide === index"
          :key="slide.id"
          class="absolute inset-0"
        >
          <!-- Background Image -->
          <div class="absolute inset-0">
            <img
              :src="getAssetUrl(slide.image)"
              :alt="slide.title"
              class="w-full h-full object-cover"
            />
            <div class="absolute inset-0 bg-black/40" />
          </div>

          <!-- Content -->
          <div class="relative h-full flex items-start justify-center pt-12 md:pt-16 lg:pt-20">
            <div class="container">
              <div class="max-w-2xl mx-auto text-center text-white">
                <h1 class="font-heading text-4xl md:text-5xl lg:text-6xl mb-4 italic">
                  {{ slide.title }}
                </h1>
                <p class="text-lg md:text-xl mb-6 text-white/90">
                  {{ slide.subtitle }}
                </p>
                <NuxtLink
                  :to="slide.cta.link"
                  class="inline-flex items-center gap-2 px-6 py-3 bg-pif-gold text-pif-black font-medium rounded-lg hover:bg-pif-gold-light transition-colors"
                >
                  {{ slide.cta.label }}
                  <Icon name="heroicons:arrow-right" class="w-5 h-5" />
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>
      </TransitionGroup>
    </div>

    <!-- Navigation Arrows -->
    <button
      class="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/20 hover:bg-white/30 rounded-full text-white transition-colors hidden md:block"
      @click="prevSlide"
    >
      <Icon name="heroicons:chevron-left" class="w-6 h-6" />
    </button>
    <button
      class="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/20 hover:bg-white/30 rounded-full text-white transition-colors hidden md:block"
      @click="nextSlide"
    >
      <Icon name="heroicons:chevron-right" class="w-6 h-6" />
    </button>

    <!-- Pagination Dots -->
    <div class="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
      <button
        v-for="(slide, index) in slides"
        :key="slide.id"
        :class="[
          'w-3 h-3 rounded-full transition-colors',
          currentSlide === index ? 'bg-white' : 'bg-white/50 hover:bg-white/75',
        ]"
        @click="goToSlide(index)"
      />
    </div>
  </section>
</template>
