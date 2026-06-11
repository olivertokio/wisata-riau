<script setup>
import { Cloud, Database, ShieldCheck, UserCog } from 'lucide-vue-next'

const envStatus = {
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL ? 'Configured' : 'Not configured',
  supabaseKey: import.meta.env.VITE_SUPABASE_ANON_KEY ? 'Configured' : 'Not configured',
  cloudinaryCloud: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME ? 'Configured' : 'Not configured',
  cloudinaryPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET ? 'Configured' : 'Not configured',
}

const settings = [
  {
    title: 'Admin Role',
    value: 'admin',
    description: 'Route admin hanya menerima sesi dengan role administrator.',
    icon: ShieldCheck,
  },
  {
    title: 'Supabase',
    value: import.meta.env.VITE_SUPABASE_URL ? 'Connected' : 'Fallback data',
    description: 'CRUD dashboard memakai tabel Supabase ketika env tersedia.',
    icon: Database,
  },
  {
    title: 'Cloudinary',
    value: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME ? 'Connected' : 'Local preview',
    description: 'Upload gambar memakai unsigned preset Cloudinary.',
    icon: Cloud,
  },
  {
    title: 'Admin Session',
    value: 'Browser store',
    description: 'Sesi dummy tersimpan lokal sampai integrasi auth penuh aktif.',
    icon: UserCog,
  },
]
</script>

<template>
  <div class="space-y-5">
    <div>
      <h2 class="text-xl font-bold text-deep-charcoal">Settings</h2>
      <p class="mt-1 text-sm font-medium text-muted-gray">Konfigurasi dasar dashboard admin.</p>
    </div>

    <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <article v-for="item in settings" :key="item.title" class="rounded-lg border border-black/10 bg-white p-5 shadow-sm">
        <div class="grid size-11 place-items-center rounded-lg bg-soft-cream text-nature-green">
          <component :is="item.icon" class="size-5" />
        </div>
        <h3 class="mt-4 text-base font-bold text-deep-charcoal">{{ item.title }}</h3>
        <p class="mt-2 text-sm font-bold text-soft-gold">{{ item.value }}</p>
        <p class="mt-3 text-sm leading-6 text-muted-gray">{{ item.description }}</p>
      </article>
    </div>

    <section class="rounded-lg border border-black/10 bg-white p-5">
      <h3 class="text-lg font-bold text-deep-charcoal">Environment Variables</h3>
      <div class="mt-4 grid gap-3 text-sm md:grid-cols-2">
        <div class="rounded-lg bg-soft-cream p-4">
          <p class="font-bold text-deep-charcoal">VITE_SUPABASE_URL</p>
          <p class="mt-1 font-medium text-muted-gray">{{ envStatus.supabaseUrl }}</p>
        </div>
        <div class="rounded-lg bg-soft-cream p-4">
          <p class="font-bold text-deep-charcoal">VITE_SUPABASE_ANON_KEY</p>
          <p class="mt-1 font-medium text-muted-gray">{{ envStatus.supabaseKey }}</p>
        </div>
        <div class="rounded-lg bg-soft-cream p-4">
          <p class="font-bold text-deep-charcoal">VITE_CLOUDINARY_CLOUD_NAME</p>
          <p class="mt-1 font-medium text-muted-gray">{{ envStatus.cloudinaryCloud }}</p>
        </div>
        <div class="rounded-lg bg-soft-cream p-4">
          <p class="font-bold text-deep-charcoal">VITE_CLOUDINARY_UPLOAD_PRESET</p>
          <p class="mt-1 font-medium text-muted-gray">{{ envStatus.cloudinaryPreset }}</p>
        </div>
      </div>
    </section>
  </div>
</template>
