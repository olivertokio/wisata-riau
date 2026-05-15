<script setup>
import { Expand, Images, MoveRight } from 'lucide-vue-next'
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import GalleryLightbox from './GalleryLightbox.vue'
import { createGalleryReveal } from '../../gsap/galleryReveal'

const props = defineProps({
  destination: {
    type: Object,
    required: true,
  },
})

const galleryRoot = ref(null)
const isLightboxOpen = ref(false)
const activeIndex = ref(0)
let galleryContext

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
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1400&q=80',
    'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1600&q=80',
  ],
  'budaya melayu': [
    'https://images.unsplash.com/photo-1518002054494-3a6f94352e9d?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1400&q=80',
    'https://images.unsplash.com/photo-1521295121783-8a321d551ad2?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1600&q=80',
  ],
  'tropical indonesia': [
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1400&q=80',
    'https://images.unsplash.com/photo-1473116763249-2faaef81ccda?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1600&q=80',
  ],
  'wisata riau': [
    'https://images.unsplash.com/photo-1493558103817-58b2924bce98?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1481833761820-0509d3217039?auto=format&fit=crop&w=1400&q=80',
    'https://images.unsplash.com/photo-1514326640560-7d063ef2aed5?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1523905330026-b8bd1f5f320e?auto=format&fit=crop&w=1600&q=80',
  ],
  'sumatra tourism': [
    'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1501555088652-021faa106b9b?auto=format&fit=crop&w=1400&q=80',
    'https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1600&q=80',
  ],
}

const galleryBlueprint = [
  {
    layout: 'lg:col-span-7 lg:row-span-2',
    frameClass: 'h-[22rem] sm:h-[28rem] lg:h-full',
    mediaClass: 'group-hover:scale-[1.08] lg:group-hover:scale-[1.05]',
    eyebrow: 'Hero Frame',
    title: 'Panorama utama destinasi',
  },
  {
    layout: 'lg:col-span-5 lg:row-span-1',
    frameClass: 'h-[16rem] sm:h-[18rem] lg:h-[15.25rem]',
    mediaClass: 'group-hover:scale-[1.09]',
    eyebrow: 'Story Frame',
    title: 'Suasana perjalanan',
  },
  {
    layout: 'lg:col-span-5 lg:row-span-1',
    frameClass: 'h-[16rem] sm:h-[18rem] lg:h-[15.25rem]',
    mediaClass: 'group-hover:scale-[1.09]',
    eyebrow: 'Story Frame',
    title: 'Detail editorial',
  },
  {
    layout: 'lg:col-span-4 lg:row-span-2',
    frameClass: 'h-[22rem] sm:h-[28rem] lg:h-full',
    mediaClass: 'group-hover:scale-[1.08]',
    eyebrow: 'Vertical Portrait',
    title: 'Komposisi vertikal',
  },
  {
    layout: 'lg:col-span-8 lg:row-span-1',
    frameClass: 'h-[16rem] sm:h-[18rem] lg:h-[16.5rem]',
    mediaClass: 'group-hover:scale-[1.07]',
    eyebrow: 'Panoramic Strip',
    title: 'Potret lanskap luas',
  },
]

const galleryImages = computed(() => {
  const keyword = categoryKeywords[props.destination.category] || 'wisata riau'
  const placeholders = placeholderLibrary[keyword] || placeholderLibrary['wisata riau']
  const uniqueSources = [props.destination.image, ...placeholders]

  return galleryBlueprint.map((item, index) => ({
    id: `${props.destination.id}-${index}`,
    src: uniqueSources[index % uniqueSources.length],
    alt: `${props.destination.name} - ${item.title}`,
    caption: `Sorotan visual bertema ${keyword} yang memperkuat suasana ${props.destination.name} dalam konteks perjalanan di Provinsi Riau.`,
    ...item,
  }))
})

function openLightbox(index) {
  activeIndex.value = index
  isLightboxOpen.value = true
}

function closeLightbox() {
  isLightboxOpen.value = false
}

function goNext() {
  activeIndex.value = (activeIndex.value + 1) % galleryImages.value.length
}

function goPrev() {
  activeIndex.value = (activeIndex.value - 1 + galleryImages.value.length) % galleryImages.value.length
}

function mountGalleryAnimation() {
  galleryContext?.revert?.()
  galleryContext = createGalleryReveal(galleryRoot.value)
}

onMounted(async () => {
  await nextTick()
  mountGalleryAnimation()
})

watch(
  () => props.destination.id,
  async () => {
    activeIndex.value = 0
    closeLightbox()
    await nextTick()
    mountGalleryAnimation()
  },
)

onBeforeUnmount(() => {
  galleryContext?.revert?.()
})
</script>

<template>
  <section ref="galleryRoot" class="mt-16">
    <div data-gallery-heading class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div class="max-w-2xl">
        <p class="text-sm font-semibold uppercase tracking-[0.24em] text-soft-gold">Galeri Editorial</p>
        <h2 class="mt-3 font-serif text-4xl font-semibold leading-tight text-deep-charcoal sm:text-5xl">
          Potret suasana destinasi
        </h2>
        <p class="mt-4 text-sm leading-7 text-muted-gray sm:text-base">
          Komposisi visual yang dirancang seperti editorial perjalanan: dramatis, imersif, dan menonjolkan ritme khas wisata di Riau.
        </p>
      </div>

      <div
        data-gallery-heading
        class="inline-flex w-fit items-center gap-3 rounded-full border border-black/6 bg-white/80 px-4 py-3 text-sm font-medium text-muted-gray shadow-sm backdrop-blur"
      >
        <span class="grid size-10 place-items-center rounded-full bg-soft-cream text-nature-green">
          <Images class="size-5" />
        </span>
        <span>{{ galleryImages.length }} frame editorial siap dibuka</span>
      </div>
    </div>

    <div class="mt-8 grid gap-4 lg:grid-cols-12 lg:auto-rows-[15.25rem]">
      <article
        v-for="(image, index) in galleryImages"
        :key="image.id"
        data-gallery-card
        class="group relative overflow-hidden rounded-[2rem] border border-white/75 bg-white p-2 shadow-[0_22px_65px_rgba(31,41,51,0.09)] ring-1 ring-black/5"
        :class="image.layout"
      >
        <button
          class="relative block w-full overflow-hidden rounded-[1.55rem] text-left"
          type="button"
          @click="openLightbox(index)"
        >
          <div class="overflow-hidden rounded-[1.55rem]">
            <img
              class="w-full object-cover transition duration-700 ease-out group-hover:-translate-y-1 group-hover:scale-[1.04]"
              :class="[image.frameClass, image.mediaClass]"
              :src="image.src"
              :alt="image.alt"
            />
          </div>

          <div class="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(10,18,15,0.06)_0%,rgba(10,18,15,0.16)_46%,rgba(10,18,15,0.62)_100%)] opacity-90 transition duration-500 group-hover:bg-[linear-gradient(180deg,rgba(10,18,15,0.08)_0%,rgba(10,18,15,0.24)_42%,rgba(10,18,15,0.74)_100%)]"></div>
          <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(201,162,39,0.16),transparent_28%)] opacity-80"></div>

          <div class="absolute inset-x-5 top-5 flex items-start justify-between gap-4">
            <div class="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-white backdrop-blur-xl">
              {{ image.eyebrow }}
            </div>
            <div class="grid size-11 place-items-center rounded-full border border-white/15 bg-black/15 text-white backdrop-blur-xl transition duration-300 group-hover:bg-white group-hover:text-deep-charcoal">
              <Expand class="size-4" />
            </div>
          </div>

          <div class="absolute inset-x-5 bottom-5">
            <p class="text-xs font-semibold uppercase tracking-[0.24em] text-soft-gold">Lihat Foto</p>
            <h3 class="mt-2 max-w-md font-serif text-2xl font-semibold leading-tight text-white">
              {{ image.title }}
            </h3>
            <p class="mt-3 max-w-md text-sm leading-7 text-white/74">
              {{ image.caption }}
            </p>
            <span class="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-white">
              Buka fullscreen
              <MoveRight class="size-4 transition duration-300 group-hover:translate-x-1" />
            </span>
          </div>
        </button>
      </article>
    </div>

    <GalleryLightbox
      :current-index="activeIndex"
      :images="galleryImages"
      :open="isLightboxOpen"
      @close="closeLightbox"
      @next="goNext"
      @prev="goPrev"
    />
  </section>
</template>
