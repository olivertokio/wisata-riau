<script setup>
defineProps({
  activities: {
    type: Array,
    default: () => [],
  },
})
</script>

<template>
  <section data-profile-activity class="rounded-[2rem] border border-black/6 bg-white/96 p-6 shadow-[0_22px_55px_rgba(31,41,51,0.06)] sm:p-7">
    <div class="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p class="text-sm font-semibold uppercase tracking-[0.22em] text-soft-gold">Aktivitas Perjalanan</p>
        <h2 class="planner-display mt-3 text-3xl font-semibold text-deep-charcoal sm:text-4xl">Jejak cerita yang sedang dibangun</h2>
      </div>
      <p class="max-w-xl text-sm leading-7 text-muted-gray sm:text-right">
        Timeline personal ini merangkum bagaimana traveler menyimpan, mengulas, dan merencanakan pengalaman wisata di Riau.
      </p>
    </div>

    <div class="relative mt-8 pl-6 sm:pl-8">
      <div class="absolute bottom-0 left-[0.7rem] top-0 w-px bg-[linear-gradient(180deg,rgba(47,107,79,0.05)_0%,rgba(47,107,79,0.3)_24%,rgba(201,162,39,0.32)_62%,rgba(47,107,79,0.06)_100%)] sm:left-[0.95rem]"></div>

      <article
        v-for="item in activities"
        :key="`${item.title}-${item.date}`"
        data-profile-activity-item
        class="relative pb-8 last:pb-0"
      >
        <div class="absolute left-[-1.05rem] top-2.5 grid size-5 place-items-center rounded-full bg-white shadow-[0_0_0_6px_rgba(47,107,79,0.08)] sm:left-[-1.3rem]">
          <div class="size-2.5 rounded-full bg-soft-gold shadow-[0_0_16px_rgba(201,162,39,0.6)]"></div>
        </div>

        <div class="rounded-[1.4rem] bg-soft-cream/55 px-5 py-5">
          <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p class="text-xs font-semibold uppercase tracking-[0.16em] text-soft-gold">{{ item.type }}</p>
              <h3 class="mt-2 text-lg font-semibold text-deep-charcoal">{{ item.title }}</h3>
              <p class="mt-2 text-sm leading-7 text-muted-gray">{{ item.description }}</p>
            </div>
            <span class="text-sm font-medium text-muted-gray">{{ item.date }}</span>
          </div>
        </div>
      </article>
    </div>
  </section>
</template>
