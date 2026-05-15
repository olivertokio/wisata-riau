<script setup>
import { Images } from 'lucide-vue-next'
import { computed } from 'vue'
import CircularGallery from '../gallery/CircularGallery.vue'

const props = defineProps({
  destination: {
    type: Object,
    required: true,
  },
})

const categoryKeywords = {
  Alam: 'alam riau',
  Budaya: 'budaya melayu',
  Bahari: 'tropical indonesia',
  Kuliner: 'wisata riau',
  Sejarah: 'sumatra tourism',
}

const placeholderLibrary = {
  'alam riau': [
    'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1600&q=80',
  ],
  'budaya melayu': [
    'https://images.unsplash.com/photo-1518002054494-3a6f94352e9d?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1600&q=80',
  ],
  'tropical indonesia': [
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1600&q=80',
  ],
  'wisata riau': [
    'https://images.unsplash.com/photo-1493558103817-58b2924bce98?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1481833761820-0509d3217039?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1523905330026-b8bd1f5f320e?auto=format&fit=crop&w=1600&q=80',
  ],
  'sumatra tourism': [
    'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1501555088652-021faa106b9b?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1600&q=80',
  ],
}

const galleryItems = computed(() => {
  const keyword = categoryKeywords[props.destination.category] || 'wisata riau'
  const placeholders = placeholderLibrary[keyword] || placeholderLibrary['wisata riau']

  return [
    {
      image: props.destination.image,
      text: props.destination.name,
    },
    {
      image: placeholders[0],
      text: 'Lanskap Riau',
    },
    {
      image: placeholders[1],
      text: props.destination.category === 'Budaya' ? 'Budaya Melayu' : 'Pesona Riau',
    },
    {
      image: placeholders[2],
      text: props.destination.category === 'Alam' ? 'Wisata Alam' : 'Travel Story',
    },
  ]
})
</script>

<template>
  <section class="mt-16 overflow-hidden rounded-[2.5rem] bg-[linear-gradient(135deg,#15201c_0%,#1F2933_42%,#0e1714_100%)] py-16 text-white shadow-[0_34px_100px_rgba(31,41,51,0.2)] sm:py-20">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
      <div class="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div class="max-w-3xl">
          <p class="text-sm font-semibold uppercase tracking-[0.3em] text-soft-gold">
            Galeri Editorial
          </p>
          <h2 class="mt-4 font-serif text-4xl font-semibold leading-tight sm:text-5xl">
            Potret suasana destinasi
          </h2>
          <p class="mt-4 max-w-2xl text-sm leading-8 text-white/68 sm:text-base">
            Orbit visual bergaya editorial untuk menangkap ritme perjalanan, cahaya, dan karakter khas {{ destination.name }} dalam konteks wisata Provinsi Riau.
          </p>
        </div>

        <div class="inline-flex w-fit items-center gap-3 rounded-full border border-white/12 bg-white/8 px-4 py-3 text-sm font-medium text-white/74 backdrop-blur-xl">
          <span class="grid size-10 place-items-center rounded-full bg-white/10 text-soft-gold">
            <Images class="size-5" />
          </span>
          <span>{{ galleryItems.length }} frame orbit editorial</span>
        </div>
      </div>

      <div class="relative mt-10 h-[520px] overflow-hidden rounded-[2rem] border border-white/10 bg-black/20 shadow-[0_26px_90px_rgba(0,0,0,0.22)] sm:h-[620px]">
        <div class="pointer-events-none absolute inset-x-0 top-0 z-10 h-24 bg-gradient-to-b from-black/28 to-transparent"></div>
        <div class="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-28 bg-gradient-to-t from-black/32 to-transparent"></div>
        <CircularGallery
          :items="galleryItems"
          :bend="3"
          text-color="#ffffff"
          :border-radius="0.05"
          :scroll-speed="2"
          :scroll-ease="0.035"
        />
      </div>
    </div>
  </section>
</template>
