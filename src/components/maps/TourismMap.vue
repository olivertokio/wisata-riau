<script setup>
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import gsap from 'gsap'
import { createApp, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { Compass, MapPin } from 'lucide-vue-next'
import router from '../../router'
import { tourismLocations } from '../../data/locations'
import { animatePopup, createMapReveal, revealMarkers } from '../../gsap/mapReveal'
import MapFilters from './MapFilters.vue'
import MapPopupCard from './MapPopupCard.vue'

const mapRoot = ref(null)
const mapElement = ref(null)
const activeCategory = ref('Semua')

let map
let revealContext
let markerLayer
const popupApps = []
const markers = new Map()

const riauCenter = [0.62, 101.72]

function markerIcon(destination, isActive = true) {
  return L.divIcon({
    className: '',
    iconSize: [64, 46],
    iconAnchor: [32, 23],
    popupAnchor: [0, -20],
    html: `
      <button class="tourism-marker ${isActive ? 'is-active' : 'is-muted'}" type="button" aria-label="${destination.title}">
        <span class="tourism-marker__pulse"></span>
        <span class="tourism-marker__core">${destination.markerCode}</span>
      </button>
    `,
  })
}

function destinationHasCategory(destination, category) {
  return destination.category
    .split(',')
    .map((item) => item.trim())
    .includes(category)
}

function getVisibleLocations() {
  if (activeCategory.value === 'Semua') {
    return tourismLocations
  }

  return tourismLocations.filter((destination) => destinationHasCategory(destination, activeCategory.value))
}

function createPopup(destination) {
  const container = document.createElement('div')
  const popupApp = createApp(MapPopupCard, { destination })
  popupApp.use(router)
  popupApp.mount(container)
  popupApps.push(popupApp)

  return container
}

function animateMarkerHover(marker) {
  const element = marker.getElement()

  if (!element) {
    return
  }

  gsap.to(element.querySelector('.tourism-marker'), {
    scale: 1.16,
    duration: 0.28,
    ease: 'power2.out',
  })
}

function animateMarkerLeave(marker) {
  const element = marker.getElement()

  if (!element) {
    return
  }

  gsap.to(element.querySelector('.tourism-marker'), {
    scale: 1,
    duration: 0.32,
    ease: 'power2.out',
  })
}

function bindMarker(destination) {
  const marker = L.marker([destination.lat, destination.lng], {
    icon: markerIcon(destination),
    riseOnHover: true,
  })

  marker.bindPopup(createPopup(destination), {
    className: 'tourism-popup',
    closeButton: false,
    maxWidth: 320,
    minWidth: 296,
    offset: [0, -8],
  })

  marker.on('mouseover', () => animateMarkerHover(marker))
  marker.on('mouseout', () => animateMarkerLeave(marker))
  marker.on('click', () => {
    map.flyTo([destination.lat, destination.lng], Math.min(Math.max(map.getZoom(), 8), 8.5), {
      duration: 0.85,
      easeLinearity: 0.25,
    })
  })
  marker.on('popupopen', (event) => {
    animatePopup(event.popup.getElement())
  })

  marker.addTo(markerLayer)
  markers.set(destination.id, marker)
}

function updateMarkers() {
  if (!map || !markerLayer) {
    return
  }

  markers.forEach((marker, id) => {
    const destination = tourismLocations.find((item) => item.id === id)
    const isActive = activeCategory.value === 'Semua' || destinationHasCategory(destination, activeCategory.value)
    marker.setIcon(markerIcon(destination, isActive))
    marker.setOpacity(isActive ? 1 : 0.28)
  })

  const visibleLocations = getVisibleLocations()

  if (visibleLocations.length > 0) {
    const bounds = L.latLngBounds(visibleLocations.map((destination) => [destination.lat, destination.lng]))
    map.flyToBounds(bounds.pad(0.26), {
      duration: 1,
      maxZoom: activeCategory.value === 'Semua' ? 8 : 10,
    })
  }
}

onMounted(async () => {
  revealContext = createMapReveal(mapRoot.value)

  map = L.map(mapElement.value, {
    zoomControl: false,
    scrollWheelZoom: false,
    dragging: true,
    tap: true,
  }).setView(riauCenter, 7)

  L.control.zoom({ position: 'bottomright' }).addTo(map)

  L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; OpenStreetMap &copy; CARTO',
    maxZoom: 19,
  }).addTo(map)

  markerLayer = L.layerGroup().addTo(map)
  tourismLocations.forEach(bindMarker)

  await nextTick()
  map.invalidateSize()
  revealMarkers([...mapElement.value.querySelectorAll('.leaflet-marker-icon')])
})

watch(activeCategory, () => {
  updateMarkers()
})

onBeforeUnmount(() => {
  popupApps.forEach((popupApp) => popupApp.unmount())
  revealContext?.revert()
  map?.remove()
})
</script>

<template>
  <section
    ref="mapRoot"
    class="relative overflow-hidden bg-[linear-gradient(180deg,#FDFCF8_0%,#F7F3EA_48%,#FDFCF8_100%)] px-4 py-20 sm:px-6 lg:px-10 lg:py-24"
    aria-labelledby="tourism-map-title"
  >
    <div class="pointer-events-none absolute inset-x-0 top-8 h-48 bg-[radial-gradient(ellipse_at_center,rgba(201,162,39,0.16),transparent_65%)] blur-3xl"></div>

    <div class="relative mx-auto max-w-7xl">
      <div class="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
        <div>
          <p class="map-reveal inline-flex items-center gap-2 rounded-full border border-soft-gold/30 bg-white/75 px-4 py-2 text-sm font-semibold text-nature-green shadow-sm backdrop-blur-xl">
            <Compass class="size-4 text-soft-gold" />
            Interactive tourism map
          </p>
          <h2 id="tourism-map-title" class="map-reveal planner-display mt-5 max-w-3xl text-4xl font-semibold leading-tight text-deep-charcoal sm:text-5xl">
            Temukan Riau dari titik perjalanan yang hidup.
          </h2>
        </div>

        <p class="map-reveal max-w-2xl text-base leading-8 text-muted-gray lg:justify-self-end">
          Pilih kategori, lihat marker bercahaya, lalu buka cerita singkat tiap destinasi langsung dari peta.
        </p>
      </div>

      <div class="mt-10 grid gap-5 lg:grid-cols-[22rem_1fr] lg:items-stretch">
        <aside class="space-y-5">
          <MapFilters v-model:active-category="activeCategory" />

          <div class="map-reveal rounded-[1.75rem] border border-black/5 bg-white/75 p-5 shadow-[0_22px_60px_rgba(31,41,51,0.07)] backdrop-blur-2xl">
            <div class="flex items-center gap-3">
              <span class="grid size-11 place-items-center rounded-full bg-nature-green text-white">
                <MapPin class="size-5" />
              </span>
              <div>
                <p class="planner-display text-2xl font-semibold text-deep-charcoal">{{ getVisibleLocations().length }}</p>
                <p class="text-sm text-muted-gray">titik destinasi aktif</p>
              </div>
            </div>
            <p class="mt-4 text-sm leading-6 text-muted-gray">
              Marker memakai singkatan nama destinasi agar mudah dikenali. Klik marker untuk melihat kartu destinasi.
            </p>
          </div>
        </aside>

        <div class="tourism-map-frame map-reveal relative min-h-[34rem] overflow-hidden rounded-[2.35rem] bg-deep-charcoal p-2 shadow-[0_36px_110px_rgba(47,107,79,0.18)] ring-1 ring-black/5 lg:min-h-[42rem]">
          <div class="pointer-events-none absolute inset-2 z-[410] rounded-[1.85rem] bg-[linear-gradient(120deg,rgba(31,41,51,0.18),transparent_38%,rgba(201,162,39,0.12)_100%)]"></div>
          <div ref="mapElement" class="h-full min-h-[32.5rem] rounded-[1.85rem] lg:min-h-[40.5rem]"></div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
:global(.leaflet-container) {
  background: #f7f3ea;
  color: #1f2933;
  font-family: var(--font-sans);
}

:global(.leaflet-control-zoom) {
  border: 0 !important;
  border-radius: 999px !important;
  overflow: hidden;
  box-shadow: 0 18px 44px rgba(31, 41, 51, 0.14) !important;
}

:global(.leaflet-control-zoom a) {
  border: 0 !important;
  color: #1f2933 !important;
  background: rgba(255, 255, 255, 0.92) !important;
}

:global(.tourism-marker) {
  position: relative;
  display: grid;
  width: 64px;
  height: 46px;
  place-items: center;
  border: 0;
  border-radius: 999px;
  background: transparent;
  cursor: pointer;
  transform-origin: center;
}

:global(.tourism-marker__pulse) {
  position: absolute;
  inset: 5px 9px;
  border-radius: inherit;
  background: rgba(201, 162, 39, 0.28);
  box-shadow: 0 0 34px rgba(201, 162, 39, 0.55);
  animation: tourism-marker-pulse 1.9s ease-out infinite;
}

:global(.tourism-marker__core) {
  position: relative;
  z-index: 1;
  display: grid;
  min-width: 44px;
  height: 30px;
  padding: 0 9px;
  place-items: center;
  border: 2px solid rgba(255, 255, 255, 0.86);
  border-radius: inherit;
  background: #2f6b4f;
  color: white;
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.04em;
  box-shadow: 0 14px 32px rgba(47, 107, 79, 0.36);
}

:global(.tourism-marker.is-muted .tourism-marker__pulse) {
  opacity: 0.18;
  animation: none;
}

:global(.tourism-marker.is-muted .tourism-marker__core) {
  background: #6b7280;
  box-shadow: none;
}

:global(.tourism-popup .leaflet-popup-content-wrapper) {
  overflow: hidden;
  border-radius: 1.4rem;
  background: rgba(255, 255, 255, 0.74);
  padding: 0;
  box-shadow: 0 28px 70px rgba(31, 41, 51, 0.2);
  backdrop-filter: blur(18px);
}

:global(.tourism-popup .leaflet-popup-content) {
  width: auto !important;
  margin: 0;
}

:global(.tourism-popup .leaflet-popup-tip) {
  background: rgba(255, 255, 255, 0.88);
}

@keyframes tourism-marker-pulse {
  0% {
    opacity: 0.74;
    transform: scale(0.68);
  }
  100% {
    opacity: 0;
    transform: scale(1.75);
  }
}
</style>
