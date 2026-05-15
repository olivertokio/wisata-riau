<script setup>
import { CalendarDays, Landmark, MapPinned, Sparkles, Wallet } from 'lucide-vue-next'
import ItineraryCard from './ItineraryCard.vue'
import PlannerMap from './PlannerMap.vue'

defineProps({
  result: {
    type: Object,
    required: true,
  },
})
</script>

<template>
  <section
    data-planner-result
    class="planner-sans w-full space-y-0 pb-16 pt-10"
  >
    <div class="overflow-hidden border-y border-black/8 bg-white/96">
      <div class="border-b border-black/6 bg-[linear-gradient(135deg,#173626_0%,#244333_65%,#2F6B4F_100%)] px-6 py-7 text-center text-white sm:px-8">
        <p class="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#EFD28E]">Summary Perjalanan</p>
        <h2 class="planner-display mt-3 text-[1.9rem] font-semibold leading-tight sm:text-[2.25rem]">
          Rencana perjalanan siap dijelajahi
        </h2>
        <p class="mx-auto mt-3 max-w-2xl text-sm leading-7 text-white/72">
          Itinerary disusun dari kombinasi preferensi perjalanan, karakter destinasi, dan ritme harian yang lebih nyaman untuk dijelajahi.
        </p>
      </div>

      <div class="px-5 py-5 sm:px-6 sm:py-6 lg:px-10">
        <div class="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          <div class="rounded-[1.1rem] bg-soft-cream/70 p-4">
            <p class="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-gray">Tipe perjalanan</p>
            <p class="mt-1.5 text-sm font-semibold text-deep-charcoal">{{ result.preferences.tripType }}</p>
          </div>
          <div class="rounded-[1.1rem] bg-soft-cream/70 p-4">
            <p class="flex items-center justify-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-gray sm:justify-start">
              <CalendarDays class="size-3.5 text-nature-green" />
              Tanggal mulai
            </p>
            <p class="mt-1.5 text-sm font-semibold text-deep-charcoal">{{ result.preferences.startDate }}</p>
          </div>
          <div class="rounded-[1.1rem] bg-soft-cream/70 p-4">
            <p class="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-gray">Durasi</p>
            <p class="mt-1.5 text-sm font-semibold text-deep-charcoal">{{ result.preferences.duration }} hari</p>
          </div>
          <div class="rounded-[1.1rem] bg-soft-cream/70 p-4">
            <p class="flex items-center justify-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-gray sm:justify-start">
              <MapPinned class="size-3.5 text-nature-green" />
              Area
            </p>
            <p class="mt-1.5 text-sm font-semibold text-deep-charcoal">{{ result.preferences.area }}</p>
          </div>
          <div class="rounded-[1.1rem] bg-soft-cream/70 p-4">
            <p class="flex items-center justify-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-gray sm:justify-start">
              <Landmark class="size-3.5 text-nature-green" />
              Kategori
            </p>
            <p class="mt-1.5 text-sm font-semibold text-deep-charcoal">{{ result.preferences.category }}</p>
          </div>
          <div class="rounded-[1.1rem] bg-soft-cream/70 p-4">
            <p class="flex items-center justify-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-gray sm:justify-start">
              <Wallet class="size-3.5 text-nature-green" />
              Budget
            </p>
            <p class="mt-1.5 text-sm font-semibold text-deep-charcoal">{{ result.preferences.budget }}</p>
          </div>
        </div>

        <div class="mt-4 rounded-[1.2rem] border border-[#2F6B4F]/10 bg-[#F8FBF8] p-4 text-left">
          <p class="text-[11px] font-semibold uppercase tracking-[0.18em] text-soft-gold">Catatan Planner</p>
          <p class="mt-2 text-sm leading-7 text-muted-gray">{{ result.note }}</p>
        </div>
      </div>
    </div>

    <div class="mx-auto max-w-[1380px] px-4 py-6 sm:px-6 lg:px-10">
      <div class="grid gap-4 lg:grid-cols-3">
      <section class="rounded-[1.5rem] border border-white/80 bg-white/96 p-5 shadow-[0_18px_50px_rgba(31,41,51,0.06)] ring-1 ring-black/5">
        <div class="flex items-center justify-between gap-3">
          <div>
            <p class="text-[11px] font-semibold uppercase tracking-[0.18em] text-soft-gold">Destinasi Pilihan</p>
            <h3 class="planner-display mt-2 text-[1.45rem] font-semibold text-deep-charcoal">Top rekomendasi</h3>
          </div>
          <div class="grid size-10 place-items-center rounded-full bg-soft-cream text-soft-gold">
            <Sparkles class="size-4.5" />
          </div>
        </div>

        <div class="mt-4 grid gap-3">
          <RouterLink
            v-for="destination in result.destinations.slice(0, 3)"
            :key="destination.id"
            :to="typeof destination.id === 'number' ? `/destination/${destination.id}` : '/explore'"
            class="group grid grid-cols-[4rem_1fr] items-center gap-3 rounded-[1rem] bg-soft-cream/75 p-2.5 transition duration-300 hover:-translate-y-0.5 hover:bg-white hover:shadow-sm"
          >
            <img class="h-14 w-full rounded-[0.9rem] object-cover" :src="destination.image" :alt="destination.name" />
            <span class="min-w-0">
              <span class="block truncate text-sm font-semibold text-deep-charcoal">{{ destination.name }}</span>
              <span class="mt-1 block truncate text-xs text-muted-gray">{{ destination.location }} &middot; {{ destination.rating }}</span>
            </span>
          </RouterLink>
        </div>
      </section>

      <section class="rounded-[1.5rem] border border-white/80 bg-white/96 p-5 shadow-[0_18px_50px_rgba(31,41,51,0.06)] ring-1 ring-black/5">
        <p class="text-[11px] font-semibold uppercase tracking-[0.18em] text-soft-gold">Penginapan</p>
        <h3 class="planner-display mt-2 text-[1.45rem] font-semibold text-deep-charcoal">Rekomendasi menginap</h3>

        <div v-if="result.stays.length > 0" class="mt-4 grid gap-3">
          <div
            v-for="stay in result.stays"
            :key="stay.name"
            class="rounded-[1rem] bg-soft-cream/75 p-4"
          >
            <p class="text-sm font-semibold text-deep-charcoal">{{ stay.name }}</p>
            <p class="mt-1 text-xs text-muted-gray">{{ stay.type }} &middot; {{ stay.area }}</p>
            <p class="mt-2 text-sm leading-6 text-muted-gray">{{ stay.note }}</p>
          </div>
        </div>

        <div v-else class="mt-4 rounded-[1rem] border border-dashed border-black/8 bg-soft-cream/60 p-4">
          <p class="text-sm font-semibold text-deep-charcoal">Penginapan tidak dipilih</p>
          <p class="mt-1 text-sm leading-6 text-muted-gray">
            Planner ini fokus pada destinasi dan ritme kunjungan harian tanpa rekomendasi menginap.
          </p>
        </div>
      </section>

      <section class="rounded-[1.5rem] border border-white/80 bg-white/96 p-5 shadow-[0_18px_50px_rgba(31,41,51,0.06)] ring-1 ring-black/5">
        <p class="text-[11px] font-semibold uppercase tracking-[0.18em] text-soft-gold">Kuliner Pilihan</p>
        <h3 class="planner-display mt-2 text-[1.45rem] font-semibold text-deep-charcoal">Rasa lokal pelengkap itinerary</h3>

        <div v-if="result.culinary.length > 0" class="mt-4 flex flex-wrap gap-2.5">
          <span
            v-for="item in result.culinary"
            :key="item"
            class="rounded-full border border-black/6 bg-soft-cream/75 px-3.5 py-2 text-sm font-medium text-deep-charcoal"
          >
            {{ item }}
          </span>
        </div>

        <div v-else class="mt-4 rounded-[1rem] border border-dashed border-black/8 bg-soft-cream/60 p-4">
          <p class="text-sm font-semibold text-deep-charcoal">Kuliner tidak disertakan</p>
          <p class="mt-1 text-sm leading-6 text-muted-gray">
            Kamu memilih itinerary tanpa rekomendasi kuliner, jadi fokus utama tetap ada pada destinasi wisatanya.
          </p>
        </div>
      </section>
      </div>
    </div>

    <section class="border-y border-black/8 bg-white/96 px-5 py-6 sm:px-6 lg:px-10">
      <div class="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p class="text-[11px] font-semibold uppercase tracking-[0.22em] text-soft-gold">Itinerary Rekomendasi</p>
          <h3 class="planner-display mt-2 text-[1.85rem] font-semibold text-deep-charcoal">Alur perjalanan harian</h3>
        </div>
        <p class="max-w-xl text-sm leading-7 text-muted-gray sm:text-right">
          Agenda dirancang per hari agar perjalanan tetap nyaman, tidak terlalu padat, dan terasa elegan saat dijalani.
        </p>
      </div>

      <div class="mt-6 grid gap-4 xl:grid-cols-2">
        <ItineraryCard
          v-for="day in result.itinerary"
          :key="day.dayNumber"
          :day="day"
        />
      </div>
    </section>

    <PlannerMap :destinations="result.destinations" />
  </section>
</template>
