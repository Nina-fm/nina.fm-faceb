<script lang="ts" setup>
  import type { Tag } from '~/types/db'

  const props = defineProps<{
    tag: Tag
  }>()

  const createdAt = computed(() => {
    return new Date(props.tag.createdAt).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
  })
</script>

<template>
  <div class="py-10">
    <Card class="bg-foreground/3 border-none">
      <CardContent>
        <div class="flex gap-5">
          <div class="flex flex-col gap-2">
            <div class="text-3xl font-bold">
              {{ tag?.name }}
            </div>
            <div class="mt-5 flex flex-col gap-2">
              <div class="text-muted-foreground flex gap-4 text-sm">
                <span class="text-muted-foreground w-28 font-bold">Couleur</span>
                <span class="h-5 w-10 rounded" :style="{ backgroundColor: tag?.color ?? '#FFFFFF' }" />
              </div>
              <div class="text-muted-foreground flex gap-4 text-sm">
                <span class="text-muted-foreground w-28 font-bold">Créer le</span>
                <span class="text-foreground">
                  {{ createdAt }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
