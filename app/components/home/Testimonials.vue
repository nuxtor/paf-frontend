<script setup lang="ts">
const cmsStore = useCmsStore()
const { cmsImageUrl } = useCms()

const testimonials = computed(() => cmsStore.testimonials)
</script>

<template>
  <section v-if="testimonials.length" class="section-padding bg-pif-cream dark:bg-dark-100">
    <div class="container">
      <div class="text-center mb-10">
        <h2 class="font-heading text-3xl md:text-4xl text-pif-black dark:text-white mb-4">
          What Our Customers Say
        </h2>
        <p class="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Real stories from families and businesses we proudly serve
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <article
          v-for="testimonial in testimonials"
          :key="testimonial.id"
          class="bg-white dark:bg-dark-200 rounded-xl p-6 shadow-sm dark:shadow-black/30"
        >
          <div class="flex items-center gap-1 mb-4 text-pif-gold">
            <Icon
              v-for="n in 5"
              :key="n"
              :name="n <= testimonial.rating ? 'heroicons:star-solid' : 'heroicons:star'"
              class="w-5 h-5"
            />
          </div>
          <blockquote class="text-gray-700 dark:text-gray-300 mb-4 italic">
            &ldquo;{{ testimonial.quote }}&rdquo;
          </blockquote>
          <div class="flex items-center gap-3">
            <img
              v-if="testimonial.image"
              :src="cmsImageUrl(testimonial.image)"
              :alt="testimonial.author_name"
              class="w-12 h-12 rounded-full object-cover"
            />
            <div
              v-else
              class="w-12 h-12 rounded-full bg-pif-green-dark text-white flex items-center justify-center font-heading text-lg"
            >
              {{ testimonial.author_name.charAt(0) }}
            </div>
            <div>
              <p class="font-medium text-pif-black dark:text-white">
                {{ testimonial.author_name }}
              </p>
              <p
                v-if="testimonial.author_location"
                class="text-xs text-gray-500 dark:text-gray-400"
              >
                {{ testimonial.author_location }}
              </p>
            </div>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>
