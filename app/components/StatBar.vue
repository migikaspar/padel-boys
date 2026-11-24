<script setup lang="ts">
defineProps<{ label: string; value: number; muted?: boolean }>()
</script>

<template>
  <div class="stat">
    <div class="flex items-baseline justify-between">
      <span class="text-sm font-semibold uppercase tracking-[0.05em] text-white/65">{{ label }}</span>
      <span class="display text-2xl" :class="muted ? 'text-white/50' : 'text-white'">{{ value }}</span>
    </div>
    <div class="mt-1.5 h-[6px] overflow-hidden rounded-full bg-white/10">
      <div
        class="stat-fill h-full origin-left rounded-full"
        :class="muted ? 'bg-white/35' : 'bg-pb-lime'"
        :style="{ width: `${value}%` }"
      />
    </div>
  </div>
</template>
