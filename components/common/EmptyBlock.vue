<script lang="ts" setup>
  withDefaults(
    defineProps<{
      title: string
    }>(),
    {
      title: 'Aucun résultat trouvé',
    },
  )
</script>

<template>
  <Card class="bg-foreground/3 @container/mixtapeform border-none">
    <CardContent class="flex items-center justify-center">
      <div class="flex w-sm flex-col items-center justify-center gap-10 py-10">
        <p class="text-lg font-semibold">{{ title }}</p>
        <div class="flex gap-2"><slot /></div>
      </div>
    </CardContent>
  </Card>
</template>
