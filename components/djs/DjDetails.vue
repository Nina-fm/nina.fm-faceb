<script lang="ts" setup>
  import type { Dj } from '~/types/db'

  const props = defineProps<{
    dj: Dj
  }>()
</script>

<template>
  <div class="py-10">
    <Card class="bg-foreground/3 border-none">
      <CardContent>
        <div class="flex gap-5">
          <div class="flex w-full flex-col gap-2">
            <div class="flex w-full items-center justify-between">
              <div :class="cn('text-3xl font-bold', { 'text-muted-foreground': !props.dj?.name })">
                {{ props.dj?.name ?? 'Sans nom…' }}
              </div>
            </div>
            <div class="mt-5 flex flex-col gap-2">
              <div class="text-muted-foreground flex gap-4 text-sm">
                <span class="text-muted-foreground w-40 font-bold">ID Utilisateur</span>
                <span class="text-foreground">
                  {{ props.dj?.userId ?? 'Aucun' }}
                </span>
              </div>
              <div class="text-muted-foreground flex gap-4 text-sm">
                <span class="text-muted-foreground w-40 font-bold">Création</span>
                <span class="text-foreground">
                  {{ new Date(props.dj?.createdAt).toLocaleDateString('fr-FR', { dateStyle: 'long' }) }}
                </span>
              </div>
              <div class="text-muted-foreground flex gap-4 text-sm">
                <span class="text-muted-foreground w-40 font-bold">Dernière modification</span>
                <span class="text-foreground">
                  {{ new Date(props.dj?.updatedAt).toLocaleDateString('fr-FR', { dateStyle: 'long' }) }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
