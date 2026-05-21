<script setup>
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { Compass, MapPinned, Route, Star } from 'lucide-vue-next'
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'

const props = defineProps({
  destinations: {
    type: Array,
    default: () => [],
  },
})

const mapElement = ref(null)
const validDestinations = computed(() => {
  return props.destinations.filter((item) => item.latitude != null && item.longitude != null)
})

const destinationPreview = computed(() => validDestinations.value.slice(0, 4))
const totalAreas = computed(() => new Set(validDestinations.value.map((item) => item.location)).size)
const averageRating = computed(() => {
  if (!validDestinations.value.length) {
    return null
  }

  const total = validDestinations.value.reduce((sum, item) => sum + Number(item.rating || 0), 0)
  return (total / validDestinations.value.length).toFixed(1)
})

let map = null
let markers = []
let routeLine = null

function formatStopOrder(index) {
  return String(index + 1).padStart(2, '0')
}

function createMarkerCode(name) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
}

function createPopupMarkup(destination, index) {
  return `
    <article class="planner-popup-card">
      <p class="planner-popup-card__eyebrow">Stop ${formatStopOrder(index)}</p>
      <h4 class="planner-popup-card__title">${destination.name}</h4>
      <p class="planner-popup-card__meta">${destination.location} &middot; ${destination.category}</p>
      <p class="planner-popup-card__rating">Rating ${destination.rating ?? '-'}</p>
    </article>
  `
}

function createMarkerIcon(destination, index) {
  return L.divIcon({
    className: '',
    iconSize: [78, 52],
    iconAnchor: [26, 44],
    popupAnchor: [16, -30],
    html: `
      <button class="planner-route-pin" type="button" aria-label="${destination.name}">
        <span class="planner-route-pin__order">${formatStopOrder(index)}</span>
        <span class="planner-route-pin__label">${createMarkerCode(destination.name)}</span>
      </button>
    `,
  })
}

function clearMap() {
  markers.forEach((marker) => marker.remove())
  markers = []
  routeLine?.remove()
  routeLine = null
}

async function renderMap() {
  await nextTick()

  if (!mapElement.value) {
    return
  }

  if (!map) {
    map = L.map(mapElement.value, {
      zoomControl: false,
      attributionControl: false,
      scrollWheelZoom: false,
      dragging: true,
      tap: true,
    })

    L.control.zoom({ position: 'bottomright' }).addTo(map)

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap &copy; CARTO',
      maxZoom: 19,
    }).addTo(map)
  }

  clearMap()

  if (!validDestinations.value.length) {
    map.setView([0.52, 101.45], 7)
    map.invalidateSize()
    return
  }

  const routeCoordinates = []

  validDestinations.value.forEach((destination, index) => {
    const latLng = [destination.latitude, destination.longitude]
    const marker = L.marker([destination.latitude, destination.longitude], {
      icon: createMarkerIcon(destination, index),
      riseOnHover: true,
    })

    marker.addTo(map)
    marker.bindPopup(createPopupMarkup(destination, index), {
      className: 'planner-map-popup',
      closeButton: false,
      maxWidth: 250,
      offset: [18, -18],
    })
    markers.push(marker)
    routeCoordinates.push(latLng)
  })

  routeLine = L.polyline(routeCoordinates, {
    color: '#C9A227',
    weight: 3,
    opacity: 0.88,
    dashArray: '10 10',
    lineCap: 'round',
  }).addTo(map)

  if (routeCoordinates.length === 1) {
    map.setView(routeCoordinates[0], 9)
  } else {
    const bounds = L.latLngBounds(routeCoordinates)
    map.fitBounds(bounds.pad(0.32), {
      maxZoom: 8.5,
      padding: [28, 28],
    })
  }

  map.invalidateSize()
}

onMounted(() => {
  renderMap()
})

watch(
  () => props.destinations,
  () => {
    renderMap()
  },
  { deep: true },
)

onBeforeUnmount(() => {
  clearMap()
  map?.remove()
  map = null
})
</script>

<template>
  <section
    data-planner-map
    class="planner-sans relative overflow-hidden border-y border-black/8 bg-[linear-gradient(180deg,#FDFCF8_0%,#F7F3EA_48%,#FDFCF8_100%)] px-5 py-7 sm:px-6 lg:px-10 lg:py-9"
  >
    <div class="pointer-events-none absolute inset-x-0 top-0 h-44 bg-[radial-gradient(circle_at_top_left,rgba(47,107,79,0.10),transparent_42%),radial-gradient(circle_at_top_right,rgba(201,162,39,0.15),transparent_34%)]"></div>

    <div class="relative">
      <div class="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
        <div class="max-w-2xl">
          <p class="inline-flex items-center gap-2 rounded-full border border-soft-gold/28 bg-white/78 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-nature-green shadow-sm backdrop-blur-xl">
            <Compass class="size-3.5 text-soft-gold" />
            Planner Map
          </p>
          <h3 class="planner-display mt-4 text-[1.9rem] font-semibold leading-tight text-deep-charcoal sm:text-[2.15rem]">
            Peta rute rekomendasi yang terasa lebih hidup.
          </h3>
          <p class="mt-3 max-w-xl text-sm leading-7 text-muted-gray">
            Marker berurutan menampilkan alur kunjungan utama, sementara garis rute membantu membaca perpindahan destinasi secara lebih cepat.
          </p>
        </div>

        <div class="grid gap-3 sm:grid-cols-3 xl:min-w-[28rem]">
          <div class="rounded-[1.25rem] border border-black/5 bg-white/78 px-4 py-4 shadow-[0_18px_44px_rgba(31,41,51,0.06)] backdrop-blur-xl">
            <p class="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-gray">Destinasi aktif</p>
            <p class="planner-display mt-2 text-3xl font-semibold text-deep-charcoal">{{ validDestinations.length }}</p>
          </div>
          <div class="rounded-[1.25rem] border border-black/5 bg-white/78 px-4 py-4 shadow-[0_18px_44px_rgba(31,41,51,0.06)] backdrop-blur-xl">
            <p class="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-gray">Area tercakup</p>
            <p class="planner-display mt-2 text-3xl font-semibold text-deep-charcoal">{{ totalAreas }}</p>
          </div>
          <div class="rounded-[1.25rem] border border-black/5 bg-white/78 px-4 py-4 shadow-[0_18px_44px_rgba(31,41,51,0.06)] backdrop-blur-xl">
            <p class="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-gray">Rata-rata rating</p>
            <p class="planner-display mt-2 text-3xl font-semibold text-deep-charcoal">{{ averageRating ?? '-' }}</p>
          </div>
        </div>
      </div>

      <div class="mt-6 grid gap-4 xl:grid-cols-[0.78fr_1.22fr]">
        <aside class="rounded-[1.9rem] border border-white/80 bg-white/80 p-5 shadow-[0_24px_68px_rgba(31,41,51,0.08)] ring-1 ring-black/5 backdrop-blur-xl">
          <div class="flex items-start justify-between gap-4">
            <div>
              <p class="text-[11px] font-semibold uppercase tracking-[0.18em] text-soft-gold">Urutan perjalanan</p>
              <h4 class="planner-display mt-2 text-[1.45rem] font-semibold text-deep-charcoal">Highlight rute utama</h4>
            </div>
            <div class="grid size-11 place-items-center rounded-full bg-[linear-gradient(135deg,#2F6B4F_0%,#173626_100%)] text-white shadow-[0_14px_34px_rgba(47,107,79,0.28)]">
              <Route class="size-4.5" />
            </div>
          </div>

          <div v-if="destinationPreview.length" class="mt-5 space-y-3">
            <article
              v-for="(destination, index) in destinationPreview"
              :key="destination.id"
              class="rounded-[1.3rem] border border-black/5 bg-soft-cream/72 p-3.5 transition duration-300 hover:-translate-y-0.5 hover:bg-white"
            >
              <div class="flex gap-3">
                <span class="grid size-11 shrink-0 place-items-center rounded-[0.95rem] bg-deep-charcoal text-sm font-semibold text-white shadow-sm">
                  {{ formatStopOrder(index) }}
                </span>
                <div class="min-w-0 flex-1">
                  <div class="flex items-start justify-between gap-3">
                    <div class="min-w-0">
                      <p class="truncate text-sm font-semibold text-deep-charcoal">{{ destination.name }}</p>
                      <p class="mt-1 flex items-center gap-1.5 text-xs text-muted-gray">
                        <MapPinned class="size-3.5 text-nature-green" />
                        {{ destination.location }}
                      </p>
                    </div>
                    <span class="inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-deep-charcoal shadow-sm">
                      <Star class="size-3.5 fill-soft-gold text-soft-gold" />
                      {{ destination.rating }}
                    </span>
                  </div>

                  <div class="mt-3 flex flex-wrap gap-2">
                    <span class="rounded-full border border-black/6 bg-white/80 px-2.5 py-1 text-[11px] font-semibold text-deep-charcoal">
                      {{ destination.category }}
                    </span>
                    <span class="rounded-full border border-nature-green/10 bg-[#F4FAF5] px-2.5 py-1 text-[11px] font-semibold text-nature-green">
                      {{ index === 0 ? 'Titik awal' : index === destinationPreview.length - 1 ? 'Titik penutup' : 'Persinggahan' }}
                    </span>
                  </div>
                </div>
              </div>
            </article>
          </div>

          <div v-else class="mt-5 rounded-[1.3rem] border border-dashed border-black/10 bg-soft-cream/65 p-4">
            <p class="text-sm font-semibold text-deep-charcoal">Belum ada koordinat aktif</p>
            <p class="mt-1.5 text-sm leading-6 text-muted-gray">
              Tambahkan destinasi dengan latitude dan longitude agar peta planner menampilkan rute secara otomatis.
            </p>
          </div>

          <div class="mt-4 rounded-[1.25rem] border border-nature-green/10 bg-[linear-gradient(135deg,rgba(47,107,79,0.08),rgba(201,162,39,0.08))] p-4">
            <p class="text-[11px] font-semibold uppercase tracking-[0.16em] text-soft-gold">Catatan peta</p>
            <p class="mt-2 text-sm leading-6 text-muted-gray">
              Rute ini bersifat visual untuk membantu membaca persebaran destinasi. Urutan kunjungan detail tetap mengikuti itinerary harian di atas.
            </p>
          </div>
        </aside>

        <div class="relative overflow-hidden rounded-[2rem] bg-deep-charcoal p-2 shadow-[0_34px_100px_rgba(47,107,79,0.18)] ring-1 ring-black/5">
          <div class="absolute left-5 top-5 z-[500] flex flex-wrap gap-2">
            <span class="rounded-full border border-white/15 bg-white/12 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-xl">
              {{ validDestinations.length }} titik aktif
            </span>
            <span class="rounded-full border border-white/15 bg-white/12 px-3 py-1.5 text-xs font-semibold text-soft-gold backdrop-blur-xl">
              {{ totalAreas }} area perjalanan
            </span>
          </div>
          <div class="pointer-events-none absolute inset-2 z-[410] rounded-[1.5rem] bg-[linear-gradient(120deg,rgba(31,41,51,0.16),transparent_38%,rgba(201,162,39,0.14)_100%)]"></div>
          <div
            ref="mapElement"
            class="h-[21rem] w-full rounded-[1.5rem] sm:h-[24rem] lg:h-[29rem]"
          ></div>

          <div class="absolute bottom-4 left-4 z-[500] max-w-xs rounded-[1rem] border border-white/15 bg-white/88 px-4 py-3 shadow-[0_14px_38px_rgba(31,41,51,0.18)] backdrop-blur-xl">
            <p class="text-[11px] font-semibold uppercase tracking-[0.18em] text-soft-gold">Live route preview</p>
            <p class="mt-1.5 text-sm leading-6 text-deep-charcoal">
              Geser peta untuk membaca persebaran destinasi. Zoom manual tersedia di sudut kanan bawah.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
:global(.leaflet-container) {
  background: linear-gradient(145deg, rgba(247, 243, 234, 0.9), rgba(253, 252, 248, 0.96));
  font-family: inherit;
}

:global(.leaflet-control-zoom) {
  border: 0 !important;
  border-radius: 999px !important;
  overflow: hidden;
  box-shadow: 0 16px 44px rgba(31, 41, 51, 0.16) !important;
}

:global(.leaflet-control-zoom a) {
  border: 0 !important;
  color: #1f2933 !important;
  background: rgba(255, 255, 255, 0.94) !important;
}

:global(.planner-route-pin) {
  position: relative;
  display: flex;
  align-items: center;
  gap: 6px;
  border: 0;
  border-radius: 9999px;
  background: transparent;
  cursor: pointer;
  padding: 0;
}

:global(.planner-route-pin__order) {
  display: grid;
  width: 26px;
  height: 26px;
  place-items: center;
  border-radius: 9999px;
  background: #c9a227;
  color: #1f2933;
  font-size: 10px;
  font-weight: 800;
  box-shadow: 0 10px 24px rgba(201, 162, 39, 0.32);
}

:global(.planner-route-pin__label) {
  display: inline-flex;
  min-width: 46px;
  height: 34px;
  align-items: center;
  justify-content: center;
  padding: 0 12px;
  border: 2px solid rgba(255, 255, 255, 0.84);
  border-radius: 9999px;
  background: #2f6b4f;
  color: white;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.08em;
  box-shadow: 0 18px 36px rgba(47, 107, 79, 0.34);
}

:global(.planner-map-popup .leaflet-popup-content-wrapper) {
  overflow: hidden;
  border-radius: 1.25rem;
  background: rgba(255, 255, 255, 0.9);
  padding: 0;
  box-shadow: 0 24px 68px rgba(31, 41, 51, 0.16);
  backdrop-filter: blur(16px);
}

:global(.planner-map-popup .leaflet-popup-content) {
  width: auto !important;
  margin: 0;
}

:global(.planner-map-popup .leaflet-popup-tip) {
  background: rgba(255, 255, 255, 0.94);
}

:global(.planner-popup-card) {
  padding: 14px 16px;
  color: #1f2933;
}

:global(.planner-popup-card__eyebrow) {
  margin: 0;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: #c9a227;
}

:global(.planner-popup-card__title) {
  margin: 6px 0 0;
  font-size: 15px;
  font-weight: 700;
}

:global(.planner-popup-card__meta) {
  margin: 6px 0 0;
  font-size: 12px;
  color: #6b7280;
}

:global(.planner-popup-card__rating) {
  margin: 10px 0 0;
  font-size: 12px;
  font-weight: 700;
  color: #2f6b4f;
}
</style>
