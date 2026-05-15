<script setup>
const user = {
  name: 'Pengunjung Riau',
  email: 'pengunjung@example.com',
  favoriteCount: 3,
}
</script>

<template>
  <section class="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-10">
    <div class="rounded-[2rem] bg-deep-charcoal p-8 text-white shadow-2xl shadow-green-950/10">
      <p class="font-semibold text-soft-gold">Data pengguna</p>
      <h1 class="mt-3 text-4xl font-semibold">Profil</h1>
      <p class="mt-3 text-white/70">Kelola identitas pengguna dan ringkasan aktivitas wisata.</p>
    </div>

    <dl class="mt-8 grid gap-4 sm:grid-cols-3">
      <div class="rounded-3xl border border-black/5 bg-white p-6 shadow-sm">
        <dt class="text-sm font-semibold text-muted-gray">Nama</dt>
        <dd class="mt-2 text-xl font-semibold">{{ user.name }}</dd>
      </div>
      <div class="rounded-3xl border border-black/5 bg-white p-6 shadow-sm">
        <dt class="text-sm font-semibold text-muted-gray">Email</dt>
        <dd class="mt-2 text-xl font-semibold">{{ user.email }}</dd>
      </div>
      <div class="rounded-3xl border border-black/5 bg-white p-6 shadow-sm">
        <dt class="text-sm font-semibold text-muted-gray">Favorit</dt>
        <dd class="mt-2 text-xl font-semibold">{{ user.favoriteCount }} destinasi</dd>
      </div>
    </dl>
  </section>
</template>
