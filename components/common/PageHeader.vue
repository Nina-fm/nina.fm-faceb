<script lang="ts" setup>
  defineProps<{
    title?: string
  }>()
</script>

<template>
  <div class="flex items-end gap-8">
    <div class="flex flex-col gap-2">
      <SidebarBreadcrumb />
      <h1 class="text-muted text-3xl font-light tracking-wide">{{ title }}</h1>
    </div>
    <div class="flex-1">
      <slot name="content" />
    </div>
    <div id="page-header-actions" class="flex items-stretch justify-end gap-2">
      <slot name="actions" />
    </div>
  </div>
</template>
