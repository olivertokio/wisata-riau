<script setup>
const props = defineProps({
  profile: {
    type: Object,
    required: true,
  },
  heroImage: {
    type: String,
    required: true,
  },
  stats: {
    type: Array,
    default: () => [],
  },
  isEditing: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['start-edit', 'save', 'update-field'])

function initials(name) {
  return name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}
</script>

<template>
  <section
    data-profile-hero
    class="relative overflow-hidden rounded-[2.25rem] border border-white/60 bg-deep-charcoal text-white shadow-[0_34px_95px_rgba(31,41,51,0.18)]"
  >
    <img
      data-profile-hero-media
      :src="heroImage"
      alt="Lanskap perjalanan Riau"
      class="absolute inset-0 h-full w-full object-cover"
    />
    <div class="absolute inset-0 bg-[linear-gradient(120deg,rgba(9,18,15,0.9)_0%,rgba(9,18,15,0.72)_34%,rgba(9,18,15,0.34)_64%,rgba(9,18,15,0.82)_100%)]"></div>
    <div class="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(201,162,39,0.22),transparent_26%),radial-gradient(circle_at_bottom_left,rgba(47,107,79,0.26),transparent_30%)]"></div>

    <div class="relative grid gap-8 px-6 py-8 sm:px-8 sm:py-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:px-10 lg:py-12">
      <div class="max-w-3xl">
        <p class="text-xs font-semibold uppercase tracking-[0.24em] text-soft-gold">Traveler Identity</p>

        <div class="mt-6 flex items-center gap-4 sm:gap-5">
          <div class="grid size-20 shrink-0 place-items-center rounded-full border border-white/18 bg-white/12 text-2xl font-semibold text-white shadow-2xl shadow-black/25 backdrop-blur-xl sm:size-24 sm:text-3xl">
            {{ initials(profile.name) }}
          </div>

          <div class="min-w-0">
            <input
              v-if="isEditing"
              :value="profile.name"
              class="planner-display w-full rounded-2xl border border-white/18 bg-white/10 px-4 py-3 text-3xl font-semibold text-white outline-none backdrop-blur-xl sm:text-4xl"
              type="text"
              @input="emit('update-field', { field: 'name', value: $event.target.value })"
            />
            <h1 v-else class="planner-display text-4xl font-semibold text-white sm:text-5xl">
              {{ profile.name }}
            </h1>

            <p class="mt-2 text-sm font-medium uppercase tracking-[0.18em] text-white/58">Eksplorasi Riau Member</p>
          </div>
        </div>

        <div class="mt-6 max-w-2xl">
          <textarea
            v-if="isEditing"
            :value="profile.tagline"
            class="w-full rounded-[1.4rem] border border-white/18 bg-white/10 px-4 py-4 text-base leading-8 text-white/84 outline-none backdrop-blur-xl"
            rows="3"
            @input="emit('update-field', { field: 'tagline', value: $event.target.value })"
          ></textarea>
          <p v-else class="max-w-2xl text-lg leading-8 text-white/76">
            {{ profile.tagline }}
          </p>
        </div>

        <div class="mt-8 grid max-w-2xl gap-3 sm:grid-cols-3">
          <div
            v-for="item in stats"
            :key="item.label"
            class="rounded-[1.35rem] border border-white/12 bg-white/10 px-4 py-4 backdrop-blur-xl"
          >
            <p class="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/55">{{ item.label }}</p>
            <p class="mt-2 planner-display text-2xl font-semibold text-white">{{ item.value }}</p>
          </div>
        </div>
      </div>

      <div class="lg:justify-self-end">
        <div class="rounded-[1.75rem] border border-white/16 bg-white/10 p-5 shadow-[0_24px_60px_rgba(0,0,0,0.18)] backdrop-blur-2xl sm:p-6">
          <p class="text-[11px] font-semibold uppercase tracking-[0.2em] text-soft-gold">Traveler Notes</p>

          <div class="mt-4 space-y-4">
            <div>
              <p class="text-xs font-semibold uppercase tracking-[0.16em] text-white/52">Email</p>
              <input
                v-if="isEditing"
                :value="profile.email"
                class="mt-2 w-full rounded-2xl border border-white/16 bg-white/10 px-4 py-3 text-sm text-white outline-none"
                type="email"
                @input="emit('update-field', { field: 'email', value: $event.target.value })"
              />
              <p v-else class="mt-2 text-sm text-white/84">{{ profile.email }}</p>
            </div>

            <div class="grid gap-3 sm:grid-cols-2">
              <div class="rounded-[1.1rem] bg-white/8 px-4 py-4">
                <p class="text-xs font-semibold uppercase tracking-[0.16em] text-white/55">Kategori favorit</p>
                <p class="mt-2 text-sm font-semibold text-white">{{ profile.favoriteCategory }}</p>
              </div>
              <div class="rounded-[1.1rem] bg-white/8 px-4 py-4">
                <p class="text-xs font-semibold uppercase tracking-[0.16em] text-white/55">Budget favorit</p>
                <p class="mt-2 text-sm font-semibold text-white">{{ profile.favoriteBudget }}</p>
              </div>
            </div>
          </div>

          <div class="mt-6 flex flex-wrap gap-3">
            <button
              v-if="!isEditing"
              class="inline-flex items-center justify-center rounded-full border border-white/18 bg-white/14 px-5 py-3 text-sm font-semibold text-white transition duration-300 hover:-translate-y-0.5 hover:bg-white hover:text-deep-charcoal"
              type="button"
              @click="emit('start-edit')"
            >
              Edit Profil
            </button>

            <button
              v-else
              class="inline-flex items-center justify-center rounded-full bg-soft-gold px-5 py-3 text-sm font-semibold text-deep-charcoal transition duration-300 hover:-translate-y-0.5 hover:bg-white"
              type="button"
              @click="emit('save')"
            >
              Simpan Perubahan
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
