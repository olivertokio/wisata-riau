<script setup>
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { MapPinned } from 'lucide-vue-next'
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'

const props = defineProps({
  destinations: {
    type: Array,
    default: () => [],
  },
})

const mapRoot = ref(null)
let map = null
let markers = []

function clearMap() {
  markers.forEach((marker) => marker.remove())
  markers = []
}

async function renderMap() {
  await nextTick()

  if (!mapRoot.value) {
    return
  }

  const validDestinations = props.destinations.filter((item) => item.latitude != null && item.longitude != null)

  if (!map) {
    map = L.map(mapRoot.value, {
      zoomControl: false,
      attributionControl: false,
      scrollWheelZoom: false,
      dragging: true,
    })

    mapRoot.value.style.background = 'linear-gradient(135deg, rgba(31,41,51,0.18), rgba(47,107,79,0.14))'
  }

  clearMap()

  if (!validDestinations.length) {
    map.setView([0.52, 101.45], 7)
    return
  }

  validDestinations.forEach((destination) => {
    const marker = L.marker([destination.latitude, destination.longitude], {
      icon: L.divIcon({
        className: 'planner-map-marker',
        html: `<div class="planner-marker-dot"></div><span class="planner-marker-label">${destination.name}</span>`,
        iconSize: [22, 22],
        iconAnchor: [11, 11],
      }),
    })

    marker.addTo(map)
    marker.bindPopup(`<strong>${destination.name}</strong><br/>${destination.location}`)
    markers.push(marker)
  })

  const bounds = L.latLngBounds(validDestinations.map((destination) => [destination.latitude, destination.longitude]))
  map.fitBounds(bounds.pad(0.25))
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
    class="planner-sans border-y border-black/8 bg-white/96 px-5 py-6 sm:px-6 lg:px-10"
  >
    <div class="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p class="text-[11px] font-semibold uppercase tracking-[0.22em] text-soft-gold">Map Preview</p>
        <h3 class="planner-display mt-2 text-[1.8rem] font-semibold text-deep-charcoal">Peta rute rekomendasi</h3>
      </div>
      <p class="max-w-xl text-sm leading-7 text-muted-gray sm:text-right">
        Marker menandai destinasi yang dipilih sistem berdasarkan kategori, area, dan rating terbaik di Riau.
      </p>
    </div>

    <div class="mt-5 overflow-hidden rounded-[1.35rem] border border-black/5 bg-soft-cream">
      <div
        ref="mapRoot"
        class="h-[18rem] w-full sm:h-[20rem]"
      ></div>
    </div>

    <div class="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      <div
        v-for="destination in destinations.slice(0, 3)"
        :key="destination.id"
        class="rounded-[1rem] bg-soft-cream/75 px-4 py-3.5"
      >
        <p class="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-gray">
          <MapPinned class="size-3.5 text-nature-green" />
          Marker aktif
        </p>
        <p class="mt-1.5 text-sm font-semibold text-deep-charcoal">{{ destination.name }}</p>
        <p class="mt-1 text-sm text-muted-gray">{{ destination.location }}</p>
      </div>
    </div>
  </section>
</template>

<style scoped>
:deep(.leaflet-container) {
  background: linear-gradient(145deg, rgba(247, 243, 234, 0.9), rgba(253, 252, 248, 0.96));
  font-family: inherit;
}

:deep(.planner-map-marker) {
  background: transparent;
  border: none;
}

:deep(.planner-marker-dot) {
  width: 14px;
  height: 14px;
  border-radius: 9999px;
  background: #2f6b4f;
  border: 3px solid #fdfcf8;
  box-shadow: 0 0 0 6px rgba(47, 107, 79, 0.18);
}

:deep(.planner-marker-label) {
  display: inline-block;
  margin-top: 10px;
  margin-left: -18px;
  white-space: nowrap;
  border-radius: 9999px;
  background: rgba(31, 41, 51, 0.88);
  color: white;
  padding: 4px 10px;
  font-size: 11px;
  font-weight: 600;
}
</style>
