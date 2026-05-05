<script setup lang="ts">
useSeoMeta({
  title: 'About Us | Premium Abrahimic Foods',
  description: 'Learn about Premium Abrahimic Foods and our commitment to quality halal products.',
})

const breadcrumbs = [{ label: 'About Us' }]
</script>

<template>
  <div>
    <!-- Hero -->
    <div class="relative h-64 md:h-80 bg-pif-green-dark">
      <div class="absolute inset-0 flex items-center justify-center">
        <h1 class="font-heading text-4xl md:text-5xl text-white">About Us</h1>
      </div>
    </div>

    <div class="container py-12">
      <TheBreadcrumb :items="breadcrumbs" />

      <div class="max-w-3xl mx-auto prose prose-lg">
        <p>
          Welcome to Premium Abrahimic Foods, your trusted source for high-quality halal meat and
          food products in the UK. We are dedicated to providing our customers with the finest
          selection of certified halal products, sourced from trusted suppliers who share our
          commitment to quality and ethical practices.
        </p>

        <h2>Our Mission</h2>
        <p>
          Our mission is to make premium halal food accessible to every household in the UK. We
          believe that everyone deserves access to high-quality, ethically sourced food that meets
          their dietary and religious requirements.
        </p>

        <h2>Quality Assurance</h2>
        <p>
          Every product we offer is certified halal by recognized certification bodies. We work
          closely with our suppliers to ensure that all our products meet the highest standards of
          quality, freshness, and halal compliance.
        </p>

        <h2>Our Commitment</h2>
        <ul>
          <li>100% Halal certified products</li>
          <li>Fresh, high-quality meat and groceries</li>
          <li>Ethical sourcing practices</li>
          <li>Nationwide delivery across the UK</li>
          <li>Excellent customer service</li>
        </ul>

        <h2>Contact Us</h2>
        <p>
          Have questions or feedback? We'd love to hear from you.
          <NuxtLink to="/contact" class="text-pif-green-dark">Get in touch</NuxtLink>
          with our friendly customer service team.
        </p>
      </div>
    </div>
  </div>
</template>
