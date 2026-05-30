<script setup>
import { Images } from 'lucide-vue-next'
import { ref, watch } from 'vue'
import CircularGallery from '../gallery/CircularGallery.vue'
import { getDestinationImages } from '../../services/destinationService'

const props = defineProps({
  destination: {
    type: Object,
    required: true,
  },
})

const galleryItems = ref([])

function mapGalleryImages(images) {
  return images
    .map((img) => ({
      image: img.image_url || img.image || img.url || img.src,
      text: img.caption || img.title || img.name || props.destination.name,
    }))
    .filter((item) => item.image)
}

async function fetchGallery() {
  if (!props.destination?.id) return

  try {
    const destinationImages = Array.isArray(props.destination.destination_images)
      ? props.destination.destination_images
      : []
    const images = destinationImages.length
      ? destinationImages
      : await getDestinationImages(props.destination.id)

    if (images && images.length > 0) {
      const mappedImages = mapGalleryImages(images)
      galleryItems.value = mappedImages.length
        ? mappedImages
        : [{ image: props.destination.image, text: props.destination.name }]
    } else {
      galleryItems.value = [
        { image: props.destination.image, text: props.destination.name },
      ]
    }
  } catch {
    galleryItems.value = [
      { image: props.destination.image, text: props.destination.name },
    ]
  }
}

watch(() => props.destination?.id, fetchGallery, { immediate: true })
</script>

<template>
  <section class="mt-16 overflow-hidden rounded-[2.5rem] bg-[linear-gradient(135deg,#15201c_0%,#1F2933_42%,#0e1714_100%)] py-14 text-white shadow-[0_34px_100px_rgba(31,41,51,0.2)] sm:py-20">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
      <div class="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div class="max-w-3xl">
          <p class="text-sm font-semibold uppercase tracking-[0.3em] text-soft-gold">
            Galeri Editorial
          </p>
          <h2 class="planner-display mt-4 text-3xl font-semibold leading-tight sm:text-5xl">
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

      <div class="relative mt-10 h-96 overflow-hidden rounded-4xl border border-white/10 bg-black/20 shadow-[0_26px_90px_rgba(0,0,0,0.22)] sm:h-128 lg:h-152">
        <div class="pointer-events-none absolute inset-x-0 top-0 z-10 h-24 bg-linear-to-b from-black/28 to-transparent"></div>
        <div class="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-28 bg-linear-to-t from-black/32 to-transparent"></div>
        <CircularGallery
          v-if="galleryItems.length > 0"
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
