<template>
  <div :class="cn('relative size-10')">
    <div
      class="border-primary absolute top-1/2 left-1/2 size-8 origin-center -translate-x-1/2 -translate-y-1/2 animate-ping rounded-full border-4"
      :style="{ animationDelay: '300ms' }"
    />
    <div
      class="border-primary absolute top-1/2 left-1/2 size-10 origin-center -translate-x-1/2 -translate-y-1/2 animate-ping rounded-full border-4"
    />
  </div>
</template>
