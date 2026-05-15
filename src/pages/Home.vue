<script setup>
import HeroSection from '../components/hero/HeroSection.vue'
import CategoryShowcase from '../components/home/CategoryShowcase.vue'
import PopularDestinationSlider from '../components/home/PopularDestinationSlider.vue'
import TourismMap from '../components/maps/TourismMap.vue'
import FooterSection from '../components/layout/FooterSection.vue'
</script>

<template>
  <div class="overflow-hidden bg-premium-white">
    <HeroSection />
    <CategoryShowcase />
    <PopularDestinationSlider />
    <TourismMap />
    <FooterSection />
  </div>
</template>
