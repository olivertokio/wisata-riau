<script setup>
import { FolderTree, MapPinned, Route, Star, Users } from 'lucide-vue-next'
import { computed, onMounted, ref } from 'vue'
import DataTable from '../../components/admin/DataTable.vue'
import StatsCard from '../../components/admin/StatsCard.vue'
import { getAdminDashboardData } from '../../services/adminService'

const dashboard = ref(null)
const isLoading = ref(true)

const stats = computed(() => dashboard.value?.stats || {})
const maxCategoryTotal = computed(() => {
  const totals = dashboard.value?.destinationByCategory?.map((item) => item.total) || [1]
  return Math.max(...totals, 1)
})

const destinationColumns = [
  { key: 'name', label: 'Nama' },
  { key: 'category', label: 'Kategori' },
  { key: 'location', label: 'Lokasi' },
  { key: 'rating', label: 'Rating' },
]

const reviewColumns = [
  { key: 'user_name', label: 'Pengguna' },
  { key: 'destination_name', label: 'Destinasi' },
  { key: 'rating', label: 'Rating' },
  { key: 'comment', label: 'Komentar' },
]

onMounted(async () => {
  dashboard.value = await getAdminDashboardData()
  isLoading.value = false
})
</script>

<template>
  <div class="space-y-6">
    <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
      <StatsCard label="Total Destinasi" :value="stats.destinations || 0" description="Konten wisata aktif" :icon="MapPinned" />
      <StatsCard label="Total Kategori" :value="stats.categories || 0" description="Segmentasi wisata" :icon="FolderTree" />
      <StatsCard label="Total Ulasan" :value="stats.reviews || 0" description="Masukan pengunjung" :icon="Star" />
      <StatsCard label="Total Pengguna" :value="stats.users || 0" description="Akun terdaftar" :icon="Users" />
      <StatsCard label="Trip Planner" :value="stats.tripPlans || 0" description="Rencana perjalanan" :icon="Route" />
    </div>

    <div v-if="isLoading" class="rounded-lg border border-black/10 bg-white p-6 text-sm font-semibold text-muted-gray">
      Memuat dashboard admin...
    </div>

    <template v-else>
      <div class="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <section>
          <div class="mb-3 flex items-center justify-between gap-3">
            <h2 class="text-lg font-bold text-deep-charcoal">Destinasi Terbaru</h2>
            <RouterLink class="text-sm font-bold text-nature-green hover:text-soft-gold" to="/admin/destinations">
              Kelola
            </RouterLink>
          </div>
          <DataTable :columns="destinationColumns" :items="dashboard.recentDestinations" />
        </section>

        <section class="rounded-lg border border-black/10 bg-white p-5">
          <h2 class="text-lg font-bold text-deep-charcoal">Destinasi per Kategori</h2>
          <div class="mt-5 space-y-4">
            <div v-for="item in dashboard.destinationByCategory" :key="item.name">
              <div class="mb-2 flex items-center justify-between text-sm">
                <span class="font-semibold text-deep-charcoal">{{ item.name }}</span>
                <span class="font-bold text-nature-green">{{ item.total }}</span>
              </div>
              <div class="h-3 overflow-hidden rounded-lg bg-soft-cream">
                <div
                  class="h-full rounded-lg bg-[linear-gradient(90deg,#2F6B4F,#C9A227)]"
                  :style="{ width: `${(item.total / maxCategoryTotal) * 100}%` }"
                />
              </div>
            </div>
          </div>
        </section>
      </div>

      <div class="grid gap-6 xl:grid-cols-[1fr_22rem]">
        <section>
          <div class="mb-3 flex items-center justify-between gap-3">
            <h2 class="text-lg font-bold text-deep-charcoal">Ulasan Terbaru</h2>
            <RouterLink class="text-sm font-bold text-nature-green hover:text-soft-gold" to="/admin/reviews">
              Moderasi
            </RouterLink>
          </div>
          <DataTable :columns="reviewColumns" :items="dashboard.recentReviews" />
        </section>

        <section class="rounded-lg border border-black/10 bg-white p-5">
          <h2 class="text-lg font-bold text-deep-charcoal">Aktivitas Admin</h2>
          <div class="mt-5 space-y-4">
            <div v-for="activity in dashboard.activity" :key="activity.id" class="flex gap-3">
              <span class="mt-1 size-2 shrink-0 rounded-full bg-soft-gold" />
              <div>
                <p class="text-sm font-semibold text-deep-charcoal">{{ activity.label }}</p>
                <p class="mt-1 text-xs font-medium text-muted-gray">{{ activity.time }}</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </template>
  </div>
</template>
