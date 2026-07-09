<script setup lang="ts">
import type { CmsHeroSlide } from '~/types/cms'

const cmsStore = useCmsStore()
const { getAssetUrl } = useAsset()
const { cmsImageUrl } = useCms()

const fallbackSlides: CmsHeroSlide[] = [
  {
    id: -1,
    heading: 'Premium Halal Meat',
    subheading: 'Quality you can trust, delivered to your door',
    image: getAssetUrl('images/meat-slides-01.jpg'),
    cta_label: 'Shop Now',
    cta_url: '/products',
    sort_order: 0,
  },
  {
    id: -2,
    heading: 'Fresh & Certified',
    subheading: '100% Halal certified products',
    image: getAssetUrl('images/meat-slides-02.jpg'),
    cta_label: 'Learn More',
    cta_url: '/pages/halal-promise',
    sort_order: 1,
  },
  {
    id: -3,
    heading: 'Wholesale Available',
    subheading: 'Special pricing for businesses',
    image: getAssetUrl('images/meat-slides-03.jpg'),
    cta_label: 'Apply Now',
    cta_url: '/wholesale',
    sort_order: 2,
  },
  {
    id: -4,
    heading: 'Free Delivery',
    subheading: 'On orders over £100',
    image: getAssetUrl('images/meat-slides-04.jpg'),
    cta_label: 'Start Shopping',
    cta_url: '/products',
    sort_order: 3,
  },
]

const slides = computed(() =>
  cmsStore.heroSlides.length > 0 ? cmsStore.heroSlides : fallbackSlides
)

const resolveImage = (slide: CmsHeroSlide) => {
  if (slide.id < 0) return slide.image
  return cmsImageUrl(slide.image)
}

const resolveMobileImage = (slide: CmsHeroSlide) => {
  if (!slide.mobile_image) return ''
  if (slide.id < 0) return slide.mobile_image
  return cmsImageUrl(slide.mobile_image)
}

const currentSlide = ref(0)
let slideInterval: ReturnType<typeof setInterval> | null = null

const nextSlide = () => {
  if (!slides.value.length) return
  currentSlide.value = (currentSlide.value + 1) % slides.value.length
}

const prevSlide = () => {
  if (!slides.value.length) return
  currentSlide.value = (currentSlide.value - 1 + slides.value.length) % slides.value.length
}

const goToSlide = (index: number) => {
  currentSlide.value = index
  resetInterval()
}

const resetInterval = () => {
  if (slideInterval) clearInterval(slideInterval)
  slideInterval = setInterval(nextSlide, 5000)
}

watch(
  () => slides.value.length,
  (len) => {
    if (currentSlide.value >= len) currentSlide.value = 0
  }
)

onMounted(() => {
  resetInterval()
})

onUnmounted(() => {
  if (slideInterval) clearInterval(slideInterval)
})
</script>

<template>
  <section
    v-if="slides.length"
    class="relative h-[400px] md:h-[500px] lg:h-[600px] bg-pif-green-dark overflow-hidden"
  >
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
          <div class="absolute inset-0">
            <picture>
              <source
                v-if="resolveMobileImage(slide)"
                :srcset="resolveMobileImage(slide)"
                media="(max-width: 767px)"
              />
              <img
                :src="resolveImage(slide)"
                :alt="slide.heading"
                class="w-full h-full object-cover"
              />
            </picture>
            <div
              class="absolute inset-0"
              :style="{ backgroundColor: slide.overlay_color || 'rgba(0,0,0,0.4)' }"
            />
          </div>

          <div class="relative h-full flex items-start justify-center pt-12 md:pt-16 lg:pt-20">
            <div class="container">
              <div
                class="max-w-2xl mx-auto text-center"
                :style="{ color: slide.text_color || '#ffffff' }"
              >
                <h1 class="font-heading text-4xl md:text-5xl lg:text-6xl mb-4 italic">
                  {{ slide.heading }}
                </h1>
                <p v-if="slide.subheading" class="text-lg md:text-xl mb-6 opacity-90">
                  {{ slide.subheading }}
                </p>
                <NuxtLink
                  v-if="slide.cta_label && slide.cta_url"
                  :to="slide.cta_url"
                  class="inline-flex items-center gap-2 px-6 py-3 bg-pif-gold text-pif-black font-medium rounded-lg hover:bg-pif-gold-light transition-colors"
                >
                  {{ slide.cta_label }}
                  <Icon name="heroicons:arrow-right" class="w-5 h-5" />
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>
      </TransitionGroup>
    </div>

    <button
      v-if="slides.length > 1"
      class="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/20 hover:bg-white/30 rounded-full text-white transition-colors hidden md:block"
      @click="prevSlide"
    >
      <Icon name="heroicons:chevron-left" class="w-6 h-6" />
    </button>
    <button
      v-if="slides.length > 1"
      class="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/20 hover:bg-white/30 rounded-full text-white transition-colors hidden md:block"
      @click="nextSlide"
    >
      <Icon name="heroicons:chevron-right" class="w-6 h-6" />
    </button>

    <div v-if="slides.length > 1" class="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
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
