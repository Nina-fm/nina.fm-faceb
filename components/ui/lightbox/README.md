<!-- Lightbox Component

A reusable fullscreen lightbox component for displaying images with overlay and custom content.

## Usage

```vue
<script setup>
const isOpen = ref(false)
</script>

<template>
  <!-- Trigger -->
  <button @click="isOpen = true">Open Lightbox</button>

  <!-- Lightbox -->
  <UiLightbox
    v-model:open="isOpen"
    src="/path/to/image.jpg"
    alt="Image description"
  >
    <h2>Custom Title</h2>
    <p>Custom description</p>
  </UiLightbox>
</template>
```

## Props

- `open`: Boolean (v-model) - Controls lightbox visibility
- `src`: String - Image source URL
- `alt`: String - Image alt text

## Slots

- Default slot: Custom content displayed at the bottom overlay

## Features

- Fullscreen overlay with smooth transitions
- Click outside to close
- Close button in top-right corner
- Responsive image sizing with padding
- Custom content overlay at bottom
- Teleported to body to avoid z-index issues
-->