<script setup>
import { Images } from 'lucide-vue-next'
import { computed } from 'vue'
import CircularGallery from '../gallery/CircularGallery.vue'
import { getPrimaryDestinationCategory } from '../../utils/destinationCategories'

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
  // Ganti daftar gambar tambahan CircularGallery di bawah ini.
  // Disarankan pakai file lokal dari folder: public/images/gallery/
  // Contoh path lokal: '/images/gallery/riau-1.jpg'
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

const siakGalleryItems = [
  // Ganti daftar gambar khusus Siak di bawah ini saat Anda sudah punya file baru.
  // Semua file saat ini diambil dari folder lokal: public/siak-gallery/
  { image: '/siak-gallery/istana%20siak.jpg', text: 'Istana Siak' },
  { image: '/siak-gallery/siak1.jpg', text: 'Fasad Siak' },
  { image: '/siak-gallery/siak2.jpg', text: 'Detail Arsitektur' },
  { image: '/siak-gallery/siak3.jpg', text: 'Interior Istana' },
  { image: '/siak-gallery/siak4.jpg', text: 'Nuansa Kesultanan' },
  { image: '/siak-gallery/5.jpg', text: 'Ruang Pamer Siak' },
]

const tangsiBelandaGalleryItems = [
  // Ganti daftar gambar khusus Tangsi Belanda di bawah ini saat Anda sudah punya file baru.
  // Semua file saat ini diambil dari folder lokal: public/tangsi-belanda/
  { image: '/tangsi-belanda/bg1.jpg', text: 'Tangsi Belanda' },
  { image: '/tangsi-belanda/bg.jpg', text: 'Fasad Bangunan' },
  { image: '/tangsi-belanda/1.jpg', text: 'Sudut Tangsi' },
  { image: '/tangsi-belanda/2.jpg', text: 'Detail Sejarah' },
  { image: '/tangsi-belanda/3.jpg', text: 'Ruang dan Struktur' },
  { image: '/tangsi-belanda/images%20(1).jpg', text: 'Nuansa Tangsi' },
]

const pantaiRupatGalleryItems = [
  // Ganti daftar gambar khusus Pantai Rupat di bawah ini saat Anda sudah punya file baru.
  // Semua file saat ini diambil dari folder lokal: public/pantai-rupat/
  { image: '/pantai-rupat/rupat.jpg', text: 'Pantai Rupat' },
  { image: '/pantai-rupat/1.jpg', text: 'Lautan Rupat' },
  { image: '/pantai-rupat/2.jpg', text: 'Pesisir Rupat' },
  { image: '/pantai-rupat/3.jpg', text: 'Nuansa Pantai' },
]

const sungaiJantanGalleryItems = [
  // Ganti daftar gambar khusus Tepian Bandar Sungai Jantan di bawah ini saat Anda sudah punya file baru.
  // Semua file saat ini diambil dari folder lokal: public/sungai-jantan/
  { image: '/sungai-jantan/bg.jpg', text: 'Tepian Bandar Sungai Jantan' },
  { image: '/sungai-jantan/1.jpg', text: 'Tepi Sungai Jantan' },
  { image: '/sungai-jantan/2.jpg', text: 'Ruang Terbuka Hijau' },
  { image: '/sungai-jantan/3.jpg', text: 'Nuansa Malam Siak' },
]

const datukPesisirGalleryItems = [
  // Ganti daftar gambar khusus Rumah Datuk Pesisir di bawah ini saat Anda sudah punya file baru.
  // Semua file saat ini diambil dari folder lokal: public/datuk-pesisir/
  { image: '/datuk-pesisir/bg.jpg', text: 'Rumah Datuk Pesisir' },
  { image: '/datuk-pesisir/1.jpg', text: 'Datuk Pesisir' },
  { image: '/datuk-pesisir/2.jpg', text: 'Detail Arsitektur Melayu' },
  { image: '/datuk-pesisir/3.jpg', text: 'Jejak Sejarah Mempura' },
  { image: '/datuk-pesisir/4.jpg', text: 'Suasana Sekitar Rumah' },
  { image: '/datuk-pesisir/5.jpg', text: 'Koridor Wisata Siak' },
]

const galleryItems = computed(() => {
  if (props.destination.id === 4) {
    return siakGalleryItems
  }

  if (props.destination.id === 7) {
    return tangsiBelandaGalleryItems
  }

  if (props.destination.id === 1) {
    return pantaiRupatGalleryItems
  }

  if (props.destination.id === 8) {
    return sungaiJantanGalleryItems
  }

  if (props.destination.id === 9) {
    return datukPesisirGalleryItems
  }

  const primaryCategory = getPrimaryDestinationCategory(props.destination)
  const keyword = categoryKeywords[primaryCategory] || 'wisata riau'
  const placeholders = placeholderLibrary[keyword] || placeholderLibrary['wisata riau']

  return [
    {
      // Gambar utama CircularGallery item pertama mengambil image dari destinasi aktif.
      // Kalau ingin ganti gambar utama per destinasi, edit field `image` di src/data/dummyData.js
      image: props.destination.image,
      text: props.destination.name,
    },
    {
      // Gambar tambahan item kedua.
      image: placeholders[0],
      text: 'Lanskap Riau',
    },
    {
      // Gambar tambahan item ketiga.
      image: placeholders[1],
      text: primaryCategory === 'Budaya' ? 'Budaya Melayu' : 'Pesona Riau',
    },
    {
      // Gambar tambahan item keempat.
      image: placeholders[2],
      text: primaryCategory === 'Alam' ? 'Wisata Alam' : 'Travel Story',
    },
  ]
})
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

      <div class="relative mt-10 h-[24rem] overflow-hidden rounded-[2rem] border border-white/10 bg-black/20 shadow-[0_26px_90px_rgba(0,0,0,0.22)] sm:h-[32rem] lg:h-[38rem]">
        <div class="pointer-events-none absolute inset-x-0 top-0 z-10 h-24 bg-gradient-to-b from-black/28 to-transparent"></div>
        <div class="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-28 bg-gradient-to-t from-black/32 to-transparent"></div>
        <!-- Ganti item gambar CircularGallery lewat computed `galleryItems` di file ini. -->
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
