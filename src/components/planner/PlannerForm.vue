<script setup>
import { BedDouble, CalendarDays, Clock3, Compass, Landmark, MapPinned, Sparkles, Utensils, Wallet } from 'lucide-vue-next'
import { computed, reactive } from 'vue'
import {
  areaOptions,
  budgetOptions,
  categoryOptions,
  durationOptions,
  tripTypes,
} from '../../data/plannerData'

defineProps({
  loading: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['submit'])

const form = reactive({
  tripType: 'Keluarga',
  startDate: '',
  duration: 3,
  category: 'Alam',
  area: 'Semua Riau',
  includeCulinary: true,
  includeStay: true,
  budget: 'Standar',
})

const showStayOption = computed(() => Number(form.duration) > 1)

const socialProof = [
  { label: 'AR', tone: 'bg-[#F2C897] text-deep-charcoal' },
  { label: 'NS', tone: 'bg-[#D9EBD9] text-deep-charcoal' },
  { label: 'RK', tone: 'bg-[#E6E1D7] text-deep-charcoal' },
]

function handleSubmit() {
  emit('submit', {
    tripType: form.tripType,
    startDate: form.startDate,
    duration: Number(form.duration),
    category: form.category,
    area: form.area,
    includeCulinary: form.includeCulinary,
    includeStay: showStayOption.value ? form.includeStay : false,
    budget: form.budget,
  })
}
</script>

<template>
  <div class="planner-sans grid gap-0 border-y border-black/10 bg-[#F7F5F1] lg:min-h-[calc(100vh-6.75rem)] lg:grid-cols-[40%_60%]">
    <section
      data-planner-form
      class="relative overflow-hidden bg-[#173626] text-white"
    >
      <img
        src="../../../public/images/gallery/bg.jpg"
        alt="Hutan tropis Riau"
        class="absolute inset-0 h-full w-full object-cover opacity-55"
      />
      <div class="absolute inset-0 bg-[linear-gradient(180deg,rgba(12,28,20,0.2)_0%,rgba(16,42,29,0.68)_36%,rgba(17,44,30,0.94)_100%)]"></div>

      <div class="relative flex h-full flex-col justify-between p-6 sm:p-8 lg:p-10 xl:p-12">
        <div class="max-w-[27rem]">
          <div class="flex items-center gap-3">
            <span class="h-px w-8 bg-soft-gold"></span>
            <p class="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#EFD28E]">
              Premium Travel Planner
            </p>
          </div>

          <h1 class="planner-display mt-8 max-w-md text-[2.8rem] font-semibold leading-[0.94] tracking-[-0.03em] text-[#DCE6DC] sm:text-[3.35rem] lg:text-[4rem]">
            Susun perjalanan yang terasa personal, rapi, dan siap dijelajahi.
          </h1>

          <div class="mt-8 max-w-sm border-l border-white/15 pl-5">
            <p class="text-[0.98rem] leading-8 text-white/70">
              Isi preferensi perjalananmu lalu biarkan sistem menyusun itinerary wisata Riau dengan nuansa premium, kuliner pilihan, dan titik destinasi yang paling relevan.
            </p>
          </div>
        </div>

        <div class="mt-12 flex flex-wrap items-center gap-4">
          <div class="flex -space-x-3">
            <span
              v-for="avatar in socialProof"
              :key="avatar.label"
              class="grid size-10 place-items-center rounded-full border-2 border-white/25 text-[11px] font-semibold shadow-lg"
              :class="avatar.tone"
            >
              {{ avatar.label }}
            </span>
          </div>
          <p class="max-w-xs text-sm leading-7 text-white/66">
            Bergabung dengan 500+ penjelajah eksklusif bulan ini
          </p>
        </div>
      </div>
    </section>

    <section
      data-planner-form
      class="bg-[linear-gradient(180deg,#FCFBF7_0%,#F7F5F1_100%)] px-6 py-6 sm:px-8 sm:py-8 lg:px-12 lg:py-10 xl:px-14"
    >
      <div class="max-w-none">
        <p class="text-xs font-semibold uppercase tracking-[0.22em] text-soft-gold">Detail Rencana Perjalanan</p>
        <h2 class="planner-display mt-4 text-[2rem] font-semibold leading-tight text-deep-charcoal sm:text-[2.35rem]">
          Tentukan preferensi Anda untuk hasil yang dipersonalisasi.
        </h2>
        <p class="mt-3 max-w-2xl text-[0.98rem] leading-7 text-muted-gray">
          Kombinasi area tujuan, durasi, kategori, dan layanan tambahan akan digunakan untuk membangun itinerary yang lebih terarah.
        </p>
      </div>

      <form class="mt-8 grid gap-8" @submit.prevent="handleSubmit">
        <div class="grid gap-x-8 gap-y-6 md:grid-cols-2">
          <label class="block">
            <span class="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-gray">Tipe perjalanan</span>
            <div class="mt-2.5 flex items-center gap-3 border-b border-black/12 py-4">
              <Compass class="size-4.5 shrink-0 text-muted-gray" />
              <select
                v-model="form.tripType"
                class="w-full appearance-none bg-transparent text-[1.15rem] font-medium text-deep-charcoal outline-none"
              >
                <option v-for="option in tripTypes" :key="option" :value="option">{{ option }}</option>
              </select>
            </div>
          </label>

          <label class="block">
            <span class="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-gray">Tanggal mulai</span>
            <div class="mt-2.5 flex items-center gap-3 border-b border-black/12 py-4">
              <CalendarDays class="size-4.5 shrink-0 text-muted-gray" />
              <input
                v-model="form.startDate"
                class="w-full bg-transparent text-[1.15rem] font-medium text-deep-charcoal outline-none"
                type="date"
                required
              />
            </div>
          </label>

          <label class="block">
            <span class="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-gray">Durasi perjalanan</span>
            <div class="mt-2.5 flex items-center gap-3 border-b border-black/12 py-4">
              <Clock3 class="size-4.5 shrink-0 text-muted-gray" />
              <select
                v-model="form.duration"
                class="w-full appearance-none bg-transparent text-[1.15rem] font-medium text-deep-charcoal outline-none"
              >
                <option v-for="duration in durationOptions" :key="duration" :value="duration">{{ duration }} hari</option>
              </select>
            </div>
          </label>

          <label class="block">
            <span class="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-gray">Kategori wisata</span>
            <div class="mt-2.5 flex items-center gap-3 border-b border-black/12 py-4">
              <Landmark class="size-4.5 shrink-0 text-muted-gray" />
              <select
                v-model="form.category"
                class="w-full appearance-none bg-transparent text-[1.15rem] font-medium text-deep-charcoal outline-none"
              >
                <option v-for="category in categoryOptions" :key="category" :value="category">{{ category }}</option>
              </select>
            </div>
          </label>

          <label class="block">
            <span class="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-gray">Area tujuan</span>
            <div class="mt-2.5 flex items-center gap-3 border-b border-black/12 py-4">
              <MapPinned class="size-4.5 shrink-0 text-muted-gray" />
              <select
                v-model="form.area"
                class="w-full appearance-none bg-transparent text-[1.15rem] font-medium text-deep-charcoal outline-none"
              >
                <option v-for="area in areaOptions" :key="area" :value="area">{{ area }}</option>
              </select>
            </div>
          </label>

          <label class="block">
            <span class="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-gray">Estimasi anggaran</span>
            <div class="mt-2.5 flex items-center gap-3 border-b border-black/12 py-4">
              <Wallet class="size-4.5 shrink-0 text-muted-gray" />
              <select
                v-model="form.budget"
                class="w-full appearance-none bg-transparent text-[1.15rem] font-medium text-deep-charcoal outline-none"
              >
                <option v-for="budget in budgetOptions" :key="budget" :value="budget">{{ budget }}</option>
              </select>
            </div>
          </label>
        </div>

        <div class="border-t border-black/8 pt-8">
          <p class="text-xs font-semibold uppercase tracking-[0.22em] text-deep-charcoal">Layanan tambahan</p>

          <div class="mt-5 grid gap-3">
            <button
              type="button"
              class="flex items-center justify-between gap-4 rounded-[1.15rem] border border-black/6 bg-white/90 px-4 py-4 shadow-[0_8px_22px_rgba(22,52,37,0.04)] transition duration-300 hover:-translate-y-0.5"
              @click="form.includeCulinary = !form.includeCulinary"
            >
              <span class="flex min-w-0 items-center gap-4 text-left">
                <span class="grid size-11 shrink-0 place-items-center rounded-full bg-[#FFE3AD] text-deep-charcoal">
                  <Utensils class="size-4.5" />
                </span>
                <span>
                  <span class="block text-base font-semibold text-deep-charcoal">Rekomendasi Kuliner</span>
                  <span class="mt-1 block text-sm text-muted-gray">Sertakan kuliner autentik Riau untuk melengkapi ritme perjalanan.</span>
                </span>
              </span>
              <span class="relative h-7 w-12 rounded-full transition duration-300" :class="form.includeCulinary ? 'bg-nature-green' : 'bg-black/12'">
                <span class="absolute top-1 size-5 rounded-full bg-white shadow-sm transition duration-300" :class="form.includeCulinary ? 'left-6' : 'left-1'"></span>
              </span>
            </button>

            <button
              type="button"
              class="flex items-center justify-between gap-4 rounded-[1.15rem] border border-black/6 bg-white/90 px-4 py-4 shadow-[0_8px_22px_rgba(22,52,37,0.04)] transition duration-300 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
              :disabled="!showStayOption"
              @click="showStayOption && (form.includeStay = !form.includeStay)"
            >
              <span class="flex min-w-0 items-center gap-4 text-left">
                <span class="grid size-11 shrink-0 place-items-center rounded-full bg-[#D7EFE0] text-deep-charcoal">
                  <BedDouble class="size-4.5" />
                </span>
                <span>
                  <span class="block text-base font-semibold text-deep-charcoal">Pilihan Penginapan</span>
                  <span class="mt-1 block text-sm text-muted-gray">
                    {{ showStayOption ? 'Tampilkan rekomendasi hotel atau homestay sesuai budget perjalanan.' : 'Akan aktif untuk perjalanan lebih dari 1 hari.' }}
                  </span>
                </span>
              </span>
              <span class="relative h-7 w-12 rounded-full transition duration-300" :class="showStayOption && form.includeStay ? 'bg-nature-green' : 'bg-black/12'">
                <span class="absolute top-1 size-5 rounded-full bg-white shadow-sm transition duration-300" :class="showStayOption && form.includeStay ? 'left-6' : 'left-1'"></span>
              </span>
            </button>
          </div>
        </div>

        <div>
          <button
            type="submit"
            class="inline-flex w-full items-center justify-center gap-3 rounded-[1rem] bg-[#173626] px-6 py-4 text-lg font-semibold text-white shadow-[0_16px_34px_rgba(22,52,37,0.16)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#204B35]"
          >
            Susun Itinerary Saya
            <Sparkles class="size-4.5" />
          </button>
          <p class="mt-3 text-center text-sm text-muted-gray">
            Estimasi waktu penyusunan: &lt; 30 detik oleh AI kurator kami.
          </p>
        </div>
      </form>
    </section>
  </div>
</template>
